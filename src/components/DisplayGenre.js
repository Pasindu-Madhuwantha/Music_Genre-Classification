import React, { useEffect, useState } from 'react'
import '../styles/DisplayGenreStyles.css'

const DisplayGenre = ({ predictedGenre }) => {
    
    const CLIENT_ID = "041e658da36f4c6383218a56609423fa";
    const CLIENT_SECRET = "5673f05eebdd4169a8d54fba0f6f1e13";
    const [accessToken, setAccessToken] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [trendingTracks, setTrendingTracks] = useState([]);

    useEffect( () => {
        //API Access Token
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET
        }

        fetch('https://accounts.spotify.com/api/token',authParameters)
        .then(result => result.json())
        .then(data => setAccessToken(data.access_token))
    }, [])

    const fetchTrendingTracks = async () => {
        setIsFetching(true);
        
        const url = `https://api.spotify.com/v1/recommendations?seed_genres=${predictedGenre.toLowerCase()}&limit=50`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+accessToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTrendingTracks(data.tracks);
                console.log(data)
            } else {
                console.error('Failed to fetch recommendations');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="genre-bars mt-4">
            <div className="genre-bar">
                {/* <div className="bar" style={{ width: '100%' }}></div> */}
                <h2 className="label text-white">Genre : {predictedGenre}</h2>
            </div>
            <div className="mt-2">
                <button type="button" className="btn btn-warning btn-lg" onClick={fetchTrendingTracks}>
                    View Trending Tracks <i className="fa-solid fa-circle-info"></i>
                </button>
            </div>
            <div className="trending-tracks mt-4">
                {trendingTracks.length > 0 && trendingTracks.map(track => (
                    <div className="card" key={track.id}>
                        <img src={track.album.images[0]?.url} className="card-img-top" alt={`${track.album.name} cover`} />
                        <div className="card-body">
                            <h5 className="card-title">{track.name}</h5>
                            <h6 className="card-subtitle mb-2 text-body-secondary">Artist: {track.artists[0].name}</h6>
                            <p className="card-text">Album: {track.album.name} <br/> Release Date: {track.album.release_date}</p>
                            <a href={track.external_urls.spotify} className="card-link" target="_blank" rel="noopener noreferrer">Link to Song</a>
                            <a href={track.album.external_urls.spotify} className="card-link" target="_blank" rel="noopener noreferrer">Link to Album</a>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default DisplayGenre