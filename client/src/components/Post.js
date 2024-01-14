import InnerHTML from 'dangerously-set-html-content'

function Post(post) {
    return (
        <div key={post.id}>
            <h3><InnerHTML html={post.title} /></h3>
            <p><InnerHTML html={post.content} /></p>
        </div>
    )
}

export default Post