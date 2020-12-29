import { RouteComponentProps } from '@reach/router'
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import * as db from '../../config/db';
import { Manga } from '../../models/Manga.model';
import { BSON } from 'mongodb-stitch-browser-sdk';


const MangaDetails: React.FC<RouteComponentProps | any> = (props) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [manga, setManga] = useState<Manga | null>(null);

    useEffect(() => {
        db.getDB('manga-library')
            .collection('titles').findOne({ _id: new BSON.ObjectId(props.id) }).then((manga: any) => {
                setIsLoaded(true);
                setManga(manga)
            }).catch(err =>
                setError(err)
            )
    }, [])
    if (error) {
        return <div>Ошибка: {error}</div>;
    } else if (!isLoaded) {
        return <div><Spin size="large" /></div>;
    } else {
        return (
            <div>
                <img src={manga?.coverUrl} alt={manga?.title} />
                {manga?.title}
            </div>
        )
    }
}
export default MangaDetails
