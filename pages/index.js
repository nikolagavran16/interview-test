import { useEffect, useState } from 'react';

export default function Home() {
    const [story, setStory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://api.storyblok.com/v2/cdn/stories/interview_story?token=KsiGzs3TNPLsEPT4LyF7Awtt&version=published`
                );
                const data = await response.json();
                setStory(data.story);
            } catch (error) {
                console.log('Content not loaded yet');
            }
        };

        fetchData();
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
            {story.content?.image && (
                <img src={story.content.image.filename} alt="yay puppy" style={{ maxWidth: '300px' }} />
            )}
        </div>
    );
}