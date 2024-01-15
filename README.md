# Konteneryzacja - Best Practice i Bezpieczeństwo
Na dzisiejszych labach zajmiecie się technologią konteneryzacji. Dowiecie się jak tworzyć i zarządzać skonteneryzowaną aplikacją oraz co nieco o sieciach w Dockerze

### Aplikacja:

Nasza aplikacja składa się z dwóch części, które będą działać w oddzielnych kontnenrach:
* api - server przechowujący posty na endpoincie /posts Można za jego pomocą odczytać aktualne posty metodą GET lub dodać nowy metodą POST
* client - aplikacja webowa wyświetlająca aktualne posty i umożliwiająca dodanie nowego

## Zadanie 1: Dockerfile

W folderze intruder są pliki za pomocą których stowrzymy kontener "intruza", z którego przprowadzimy atak na aplikację. Stwórz Dockerfile bazujący na obrazie `alpine:latest`, który:
* przejdzie do folderu jsons
* stworzy użytkownika baim i zmień się na niego
* skopiuje pliki z folderu intruder
    - uwaga - plik sensitive.json zawiera wrażliwe dane osobowe - uniknij skopiowania go do obrazu kontenera - [wskazówka z dokumentacji Dockera](https://docs.docker.com/build/building/context/#dockerignore-files)
* zainstaluje curl - przyda się później (`apk add curl`)
    - Uzyjesz instrukcji [RUN czy CMD](https://betterstack.com/community/questions/difference-between-run-and-cmd-in-dockerfile/)?
* na końcu zostaw `CMD ["tail", "-f", "/dev/null"]`
    - Dla ciekawych: [Why run tail -f /dev/null to keep the container running?](https://github.com/docker/getting-started/issues/201)

Następnie stwórz obraz: 

`docker build -t nazwa_obrazu:tag_opcjonalnie ścieżka/do/folderu/z/Dockerfile`

Następnie uruchamiamy aplikację. W folderze z docker-compose.yaml wykonaj `docker-compose up`

Tworzymy kontener intruza:

`docker run --name nazwa_kontenera --rm -it --network baim-konteneryzacja_default nazwa_obraz:tag_jeśli_nadaliśmy`

Wyjaśnienie flag:
* --name: nadanie nazwy kontenerowi
* --rm: kontener zostanie automatycznie usunięty po tym jak go zatrzymamy
* -i: tryb interaktywny
* -t: utworzenie pseudo-terminala, w połączeniu z -i uruchamiają sesję w terminalu kontenera
* --network: dołączenie do sieci stworzonej przez `docker-compose`


Sprawdź jakie adres IP ma kontener z api (baim_api_c): 
`docker inspect baim_api_c | grep IPAddres` lub `docker inspect baim_api_c | findstr "IPAddres"` na Windowsie

W kontenrze z intruzem wykonaj `curl IP_kontera:4000/posts`, czy api zadziałało zgodnie z tym czego sie spodziewałeś?

Wykonaj to samo polecenie na swoim komputerze. Czy zadziałało? Czy jest łączność z tym adresem IP? Jak myślisz dlaczego?

W odpowiedzi wyślij pliki które posłużyły do stworzenia kontnera.

### Dla ambitnych

Zabdaj z jakiego adresu IP są wysyłane zapyania do api

Do pliku `api/index.js` dodaj następujący kod:
```
app.use((req, res, next) => {
  const clientIp = req.ipInfo.clientIp;
  console.log(`Request from IP: ${clientIp}`);
  next();
});
```

Stwórz obraz: `docker build -t nazwa_obrazu api`
I uruchom kontener `docker run --name nazwa_kontenera --rm -p 4000:4000 nazwa_obrazu`

Teraz zobaczysz adresy IP z których przychodzą zapytania

Wejdź na http://localhost:4000/posts

Z innego urządzenia (np. telefonu jeśli korzystasz z WiFi) wejdź na http://adres_ip_twojego_komputera:4000/posts

Czy IP się różni?

Więcej o sieciach w Dockerze: [Understanding Docker Bridge Network](https://medium.com/@augustineozor/understanding-docker-bridge-network-6e499da50f65)

## Zadanie 2: `docker-compose`

docker-compose pozwala na zautomatyzownaie tworzenia obrazów i kontenerów

Wyłącz aplikację usuwając obrazy  oraz kontener z intruzem i jego obraz
```
docker-compose down --rmi all //usunięcie kontenerów i obrazów stowrzonych przez compose
docker rm baim_intruder_c -f //usunięcie kontnenera intruza
docker rmi baim_intruder // usunięcie obrazu intruza
```

dołącz intruza do pliku docker-compose:
```
services:
  nazwa_obrazu:
    build: ./folder/zawierający/Dockerfile
    container_name: nazwa_kontenera
```

Zapisz zmiany i uruchom `docker-compose up`.

W odpowiedzi wyślij plik docker_compose.yaml

### Atak

Przeprowadzimy prosty atak na XSS na aplikację

Otwórz [aplikację klienta](http://localhost:3000)

Sprawdź adres IP kontenera z api

Wejdź do terminala intruza `docker exec -it nazwa_kontenera /bin/sh`

Wyslij curlem json z przykładowym postem:

`curl -X POST -H "Content-Type: application/json" --data @example_post.json http://ip_kontenera:4000/posts`

Czy post pojawia się u klienta?

W aplikacji spróbuj wysłać post z kodem JS np. `<script>alert('XSS');</script>`, czy atak się powiódł?

Aplikacja sanityzuje dane które wysyła do api, ale nie sanityzuje danych które otrzymuje. Teraz wyślij 'zainfekowany' json

`curl -X POST -H "Content-Type: application/json" --data @infected_post.json http://ip_kontenera:4000/posts`

Czy ten atak się powiódł?

## Zadanie 3: Wyłączenie icc

Wyłacz aplikację: 

`docker-compose down`

W docker-compose.yaml stwórz sieć z wyłączoną komunikacją między kontenerami
```
networks:
  baim_net:
    driver: bridge
    options:
      com.docker.network.bridge.enable_icc: "false"
```
Dołącz kontenery do sieci, do każdego z nich dodaj:
```
    networks:
      - baim_net
```

Zapisz zmiany i urucho aplikację `docker-compose up`

Wejdź do terminala intruza `docker exec -it nazwa_kontenera /bin/sh`

Spróbuj połączyć się z api lub clientem, czy jest to możliwe?

W odpowiedzi wyślij `docker-compose.yaml`

Gratulujemy dotarcia do końca i dzeki za uwagę

```
                    ##        .            
              ## ## ##       ==            
           ## ## ## ##      ===            
       /""""""""""""""""\___/ ===        
  ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~   
       \______ o          __/            
         \    \        __/             
          \____\______/                
```