# parent image
FROM alpine:latest
# zainstaluj curl i nmap (apk add) RUN czy CMD?
RUN apk add curl nmap
# uwórz użytkownika baim i zmień się na niego
RUN adduser -D -u 1001 baim

USER baim
# przejdz do folderu jsons
WORKDIR /jsons
# skopiuj wszystkie pliki
COPY . .

# na koniec
CMD ["tail", "-f", "/dev/null"]