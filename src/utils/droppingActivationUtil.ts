import { IDetailInventoryItem } from "components/interfaces";


export const AUSSCHEIDEN = "Ausscheiden";
export const DEAKTIVIEREN = "Deaktivieren";

export class DroppingActivationUtil {
    static isAusscheiden = (item: IDetailInventoryItem) => item.droppingQueue === AUSSCHEIDEN;
    static isDeaktivieren = (item: IDetailInventoryItem) => item.droppingQueue === DEAKTIVIEREN;

    static unsetDroppingProperties = (item: IDetailInventoryItem) => {
        item.droppingQueueRequester = undefined;
        item.droppingQueueDate = undefined;
        item.droppingQueuePieces = undefined;
        item.droppingQueueReason = undefined;
        item.droppingQueue = undefined;
    };
}
