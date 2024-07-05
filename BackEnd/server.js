"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/server.js
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const schema_1 = require("./models/schema");
const YT_Basketball_json_1 = __importDefault(require("./YT_Basketball.json"));
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const dbURI = process.env.DB_URI;
mongoose_1.default.connect(dbURI)
    .then((result) => {
    console.log('Connected to db');
    app.listen(port, () => { console.log(`Server is running on http://localhost:${port}`); });
})
    .catch((err) => console.log(err));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hello");
    const videoList = yield schema_1.Video.find().exec();
    console.log(videoList);
    res.send('Hello from the backend!');
}));
app.get('/api/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("accessing data");
    const videoListDoc = yield schema_1.VideoList.findOne().exec();
    const videoList = videoListDoc === null || videoListDoc === void 0 ? void 0 : videoListDoc.videoList;
    console.log(videoList);
    res.json(videoList);
}));
app.delete('/api/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
function videoDateSort(a, b) {
    const date_a = new Date(a.Published_At);
    const date_b = new Date(b.Published_At);
    if (date_a > date_b) {
        return 1;
    }
    else if (date_a < date_b) {
        return -1;
    }
    else {
        return a.Position - b.Position;
    }
}
app.get('/pushing2mongoList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoList = YT_Basketball_json_1.default.map((item, index) => {
        const vid = new schema_1.Video({
            Video_Link: item.Video_Link,
            Title: item.Title,
            Published_At: item.Published_At,
            Thumbnail_URL: item.Thumbnail_URL,
            Description: item.Description,
            Position: index
        });
        console.log(vid);
        return vid;
    });
    videoList.sort((a, b) => videoDateSort(a, b)); // Helper function, judges dates and their relative order
    videoList.forEach((item, index) => item.Position = index);
    const videoListDocument = new schema_1.VideoList({ videoList: videoList });
    yield videoListDocument.save()
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
    res.send("videos saved :3");
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let videoListDoc = yield schema_1.VideoList.findOne().exec();
    const { video_Link, title, published_at, thumbnail_URL, description } = req.body;
    const position = videoListDoc ? videoListDoc.videoList.length : 0;
    const vid = new schema_1.Video({
        Video_Link: video_Link,
        Title: title,
        Published_At: published_at,
        Thumbnail_URL: thumbnail_URL,
        Description: description,
        Position: position
    });
    let newList;
    if (!videoListDoc) {
        newList = new schema_1.VideoList({ videoList: [vid] });
        yield newList.save();
        console.log("No doc found, new created. Video saved: ", vid);
    }
    else {
        videoListDoc.videoList.push(vid);
        videoListDoc.videoList.sort((a, b) => videoDateSort(a, b));
        videoListDoc.videoList.forEach((item, index) => item.Position = index);
        yield videoListDoc.save();
        newList = videoListDoc;
        console.log("Video saved to existing list: ", vid);
    }
    res.send(newList);
}));
