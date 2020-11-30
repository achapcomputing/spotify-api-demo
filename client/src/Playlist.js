import React from 'react'

export default function Playlist({ playlists }) {
    return (
        <div>
            <h1>Dog!</h1>

            <ul>
                {
                    playlists.map(post => (
                        <li key={post.id}>
                            {post.name}
                        </li>
                    ))
                }
            </ul>

            {/* <p> {JSON.stringify(playlists)} </p> */}
        </div>
    )
}
