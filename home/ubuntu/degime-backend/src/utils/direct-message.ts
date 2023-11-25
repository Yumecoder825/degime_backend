import { ObjectId } from "mongoose";

export const getDirectChannelId = (from: string | ObjectId, to: string | ObjectId) => {
    let [small, big] = [from, to]
    if(small > big) {
        [small, big] = [big, small]
    }
    return `${small}-${big}`;
}
