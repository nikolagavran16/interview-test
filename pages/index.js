import { useEffect, useState } from 'react';

export default function Home() {
    const [story, setStory] = useState(null);
    const [assets, setAssets] = useState(null);

    useEffect(() => {
        const token = 'YZlaiEASQmcqeE31jeOdNwtt-112339250310788-_R1ucy2NyfT_s2bPLDCc';
        const headers = {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        }

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://api.storyblok.com/v2/cdn/stories/interview_story?token=KsiGzs3TNPLsEPT4LyF7Awtt`
                );
                const data = await response.json();
                setStory(data.story);
                console.log(data.story);
            } catch (error) {
                console.log('Content not loaded yet');
            }
        };

        const fetchAssets = async () => {
            try {
                const response = await fetch(
                    `https://mapi.storyblok.com/v1/spaces/288497814063714/assets/`, {
                    headers: headers
                }
                );
                const data = await response.json();
                setAssets(data.assets);
                console.log(data.assets);
            } catch (error) {
                console.log('Content not loaded yet');
            }
        };

        fetchData();
        fetchAssets();
    }, []);

    if (!story) {
        return (
            <div>
                <h1>Storyblok Interview Test</h1>
                <p>Website for Technical Support Engineer 2 task</p>
                <p>Loading content from Storyblok...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Storyblok Interview Test</h1>
            <p>Website for Technical Support Engineer 2 task</p>

            <h2>{story.content?.title || 'Default Title'}</h2>
            <p>{story.content?.description || 'Default Description'}</p>

            <div>
                {assets && assets.map((item, index) => (
                    <img src={item.filename} alt="yay puppy" style={{ maxWidth: '300px' }} />
                ))
                }
            </div>

        </div>
    );
}