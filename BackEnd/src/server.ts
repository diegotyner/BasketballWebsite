// backend/server.js
import express, { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Video, VideoList, IVideo, IVideoList } from './models/schema';

// import data from '../YT_Basketball.json';

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


// Util for sorting video dates. 
function videoDateSort(a: IVideo, b: IVideo) {
  const date_a = new Date(a.Published_At);
  const date_b = new Date(b.Published_At);

  if (date_a > date_b) {
    return 1;
  } else if (date_a < date_b) {
    return -1;
  } else {
    return a.Position - b.Position;
  }
} 



app.get('/', async (req: Request, res: Response) => {
  console.log("[GET] / ------")
  // const videoList: IVideo[] = await (Video.find().exec() as unknown as IVideo[]);
  // console.log(videoList)
  res.send('Hello from the backend!');
});


app.get('/api/data', async (req: Request, res: Response) => {
  console.time('API Access')
  console.log("[GET] /api/data ------")
  const videoListDoc: IVideoList | null = await VideoList.findOne().exec();
  const videoList = videoListDoc?.videoList
  console.log("Length: ", videoList?.length)
  console.timeEnd('API Access')
  res.json(videoList);
});


app.delete('/api/delete', async (req: Request, res: Response) => {
  console.log("[delete] / ------")
  const { vidId } = req.body

  try {
    const videoListDoc: IVideoList | null = await VideoList.findOne().exec();
    const videoList = videoListDoc?.videoList;
    if (!videoList) {
      return res.status(404).send('Video list not found');
    }
    const videoIndex = videoList.findIndex(video => video._id?.toString() === vidId);
    if (videoIndex === -1) {
      return res.status(404).send('Video not found');
    }
    videoList.splice(videoIndex, 1);
    videoList.forEach((item, index) => item.Position = index);
    await videoListDoc.save();
    res.status(200).send('Video updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  };
});


app.post('/api/add', async (req: Request, res: Response) => {
  console.log("[POST] / ------")
  console.log(req.body)
  const { videoLink, title, publishedAt, thumbnailUrl, description } = req.body;
  if (!videoLink || !title || !publishedAt || !thumbnailUrl || !description) {
    console.log("Incomplete Request")
    return res.status(400).send('All fields are required');
  }
  try {
    let videoListDoc: IVideoList | null = await VideoList.findOne().exec()
    const position = videoListDoc ? videoListDoc.videoList.length : 0;

    const vid = new Video({
      Video_Link: videoLink,
      Title: title,
      Published_At: publishedAt,
      Thumbnail_URL: thumbnailUrl,
      Description: description,
      Position: position
    })
    console.log(vid)

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
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred'); 
  };
});

app.put('/api/edit', async (req: Request, res: Response) => {
  console.log("[PUT] / ------")
  console.log(req.body)
  const { videoLink, title, publishedAt, thumbnailUrl, description, vidId } = req.body;
  if (!videoLink || !title || !publishedAt || !thumbnailUrl || !description || !vidId) {
    console.log("Incomplete Request")
    return res.status(400).send('All fields are required');
  }

  try {
    const videoListDoc: IVideoList | null = await VideoList.findOne().exec();
    const videoList = videoListDoc?.videoList;
    if (!videoList) {
      return res.status(404).send('Video list not found');
    }
    const videoIndex = videoList.findIndex(video => video._id?.toString() === vidId);
    if (videoIndex === -1) {
      return res.status(404).send('Video not found');
    }
    videoList[videoIndex].Video_Link = videoLink;
    videoList[videoIndex].Title = title;
    videoList[videoIndex].Published_At = publishedAt;
    videoList[videoIndex].Thumbnail_URL = thumbnailUrl;
    videoList[videoIndex].Description = description;

    videoList.sort((a,b) => videoDateSort(a, b));
    videoList.forEach((item, index) => item.Position = index);
    
    await videoListDoc.save();
    res.status(200).json({ message: 'Video updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  };
});



// app.get('/pushing2mongoList', async (req: Request, res: Response) => {
//   const videoList: IVideo[] = data.map((item, index) => {
//     const vid = new Video({
//       Video_Link: item.Video_Link,
//       Title: item.Title,
//       Published_At: item.Published_At,
//       Thumbnail_URL: item.Thumbnail_URL,
//       Description: item.Description,
//       Position: index
//     });
//     console.log(vid)
//     return vid;
//   });
//   videoList.sort((a,b) => videoDateSort(a, b)); // Helper function, judges dates and their relative order
//   videoList.forEach((item, index) => item.Position = index);
//   const videoListDocument = new VideoList({ videoList: videoList});
//   await videoListDocument.save()    
//     .then(() => console.log('Videos saved:'))
//     .catch(err => console.error('Error saving video:', err));

//   res.send("videos saved :3")
// });


