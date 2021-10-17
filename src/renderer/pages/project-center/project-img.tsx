import music from '@imgs/project-icons/music.svg';
import statistics from '@imgs/project-icons/static.svg';
import prize from '@imgs/project-icons/prize.svg';
import plane from '@imgs/project-icons/plane.svg';
import fly from '@imgs/project-icons/fly.svg';
import earth from '@imgs/project-icons/earth.svg';
import crown from '@imgs/project-icons/crown.svg';
import medal from '@imgs/project-icons/medal.svg';

import wmusic from '@imgs/project-icons/music-w.svg';
import wstatistics from '@imgs/project-icons/static-w.svg';
import wprize from '@imgs/project-icons/prize-w.svg';
import wplane from '@imgs/project-icons/plane-w.svg';
import wfly from '@imgs/project-icons/fly-w.svg';
import wearth from '@imgs/project-icons/earth-w.svg';
import wcrown from '@imgs/project-icons/crown-w.svg';
import wmedal from '@imgs/project-icons/medal-w.svg';

interface Map {
    [key: string]: any;
    [index: number]: any;
}

const images:Map = {
    music,
    statistics,
    prize,
    plane,
    fly,
    earth,
    crown,
    medal,
    wmusic,
    wstatistics,
    wprize,
    wplane,
    wfly,
    wearth,
    wcrown,
    wmedal,
};

function getProjectImgByKey(key?:string) {
    return key ? images[key] : images.wmusic;
}

export default getProjectImgByKey;
