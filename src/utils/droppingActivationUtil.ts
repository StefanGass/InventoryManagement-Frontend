import { IDetailInventoryItem } from 'components/interfaces';

export const AUSSCHEIDEN = 'AUSSCHEIDEN';
export const DEAKTIVIEREN = 'DEAKTIVIEREN';

// TODO refactor to functions instead of a class

export class DroppingActivationUtil {
    static isDrop = (item: IDetailInventoryItem) => item.droppingQueue === AUSSCHEIDEN;
    static isDeactivate = (item: IDetailInventoryItem) => item.droppingQueue === DEAKTIVIEREN;

    static unsetDroppingProperties = (item: IDetailInventoryItem) => {
        item.droppingQueueRequester = undefined;
        item.droppingQueueDate = undefined;
        item.droppingQueuePieces = undefined;
        item.droppingQueueReason = undefined;
        item.droppingQueue = undefined;
    };
}
