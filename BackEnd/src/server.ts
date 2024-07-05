// backend/server.js
import express, { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Video, VideoList, IVideo, IVideoList } from './models/schema';

import data from '../YT_Basketball.json';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbURI = process.env.DB_URI
mongoose.connect(dbURI as string)
  .then( (result) => {
    console.log('Connected to db')
    app.listen(port, () => {console.log(`Server is running on http://localhost:${port}`)});
  })
  .catch( (err) => console.log(err));

app.get('/', async (req: Request, res: Response) => {
  console.log("Hello")
  const videoList: IVideo[] = await (Video.find().exec() as unknown as IVideo[]);
  console.log(videoList)
  res.send('Hello from the backend!');
});
app.get('/api/data', async (req: Request, res: Response) => {
  console.log("accessing data")
  const videoListDoc: IVideoList | null = await VideoList.findOne().exec();
  const videoList = videoListDoc?.videoList
  console.log(videoList)
  res.json(videoList);
});

app.delete('/api/delete', async (req: Request, res: Response) => {

});

function videoDateSort(a: IVideo, b: IVideo) {
  const date_a = new Date(a.Published_At);
  const date_b = new Date(b.Published_At);

  if (date_a > date_b) {
    return 1
  } else if (date_a < date_b) {
    return -1
  } else {
    return a.Position - b.Position
  }
} 
app.get('/pushing2mongoList', async (req: Request, res: Response) => {
  const videoList: IVideo[] = data.map((item, index) => {
    const vid = new Video({
      Video_Link: item.Video_Link,
      Title: item.Title,
      Published_At: item.Published_At,
      Thumbnail_URL: item.Thumbnail_URL,
      Description: item.Description,
      Position: index
    });
    console.log(vid)
    return vid;
  });
  videoList.sort((a,b) => videoDateSort(a, b)); // Helper function, judges dates and their relative order
  videoList.forEach((item, index) => item.Position = index);
  const videoListDocument = new VideoList({ videoList: videoList});
  await videoListDocument.save()    
    .then(() => console.log('Videos saved:'))
    .catch(err => console.error('Error saving video:', err));

  /*   
  videoList.sort((a,b) => videoDateSort(a, b)) // Helper function, judges dates and their relative order
  videoList.forEach(video => {
    video.save()
    .then(() => console.log('Video saved:'))
    .catch(err => console.error('Error saving video:', err))
  });
  */

  res.send("videos saved :3")
});



app.post('/', async (req: Request, res: Response) => {
  let videoListDoc: IVideoList | null = await VideoList.findOne().exec()
  const { video_Link, title, published_at, thumbnail_URL, description } = req.body;
  const position = videoListDoc ? videoListDoc.videoList.length : 0;

  const vid = new Video({
    Video_Link: video_Link,
    Title: title,
    Published_At: published_at,
    Thumbnail_URL: thumbnail_URL,
    Description: description,
    Position: position
  })

  let newList: IVideoList;
  if (!videoListDoc) {
    newList = new VideoList({ videoList: [vid] });
    await newList.save()
    console.log("No doc found, new created. Video saved: ", vid)
  } else {
    videoListDoc.videoList.push(vid)
    videoListDoc.videoList.sort((a,b) => videoDateSort(a, b));
    videoListDoc.videoList.forEach((item, index) => item.Position = index);
    await videoListDoc.save() 
    newList = videoListDoc
    console.log("Video saved to existing list: ", vid)
  }
  res.send(newList)
});
