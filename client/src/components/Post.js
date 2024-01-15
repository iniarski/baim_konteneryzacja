import InnerHTML from 'dangerously-set-html-content'

function Post(post) {
    return (
        <div className="col s12 m6">
        <div key={post.id} className='card grey darken-2'>
            <div className="card-content">
            <h3 className='card-title'><InnerHTML html={post.title}/></h3>
            <hr />
            <p><InnerHTML html={post.content} /></p>
            </div>
        </div>
        </div>
    )
}

export default Post