import { useCallback } from 'react';

interface Asset<Data = unknown> {
  data?: Data;
  action: () => Promise<unknown>;
  resolve: <T extends Data>(value: T | PromiseLike<T>) => void;
  reject: (value: unknown) => void;
}

interface QueueItem {
  assets: Asset[];
  pending: boolean;
}

interface QueueParams {
  delayTime: number;
}

const state = new Map<string, QueueItem>();
const callbacks = new Map<string, (item: QueueItem, asset: Asset) => void>();

/**
 * @name useQueue
 * @description Simple Queue to execute promises sequentially
 *
 * For example, we can create a queue that writes quickly to a document with ID
 * /doc/1, but we want to execute the writes sequentially to avoid
 * race-conditions
 *
 * Usage:
 *
 * const queue = useQueue();
 * const [isWriting, setIsWriting] = useState();
 *
 * const docId = '/doc/1';
 *
 * queue.subscribe(docId, ({ pending }) => {
 *   setIsWriting(pending);
 * });
 *
 * queue.enqueue(
 *  docId,
 *  addDoc(doc(docId, data))
 * );
 *
 * queue.enqueue(
 *  docId,
 *  updateDoc(doc(docId, data))
 * );
 *
 * queue.clear(docId);
 */
function useQueue(params?: Partial<QueueParams>) {
  const delayTime = params?.delayTime;

  const subscribe = (
    key: string,
    callback: (item: QueueItem, asset: Asset) => void,
  ) => {
    callbacks.set(key, callback);
  };

  const dequeue = useCallback(
    async (key: string) => {
      const item = state.get(key);

      if (!item || item.pending) {
        return;
      }

      const nextAsset = item.assets.shift();

      if (!nextAsset) {
        return;
      }

      const next = (asset?: Asset) => {
        item.pending = false;

        const callback = callbacks.get(key);

        if (callback && asset) {
          callback(item, asset);
        }

        if (delayTime) {
          setTimeout(() => dequeue(key), delayTime);
        } else {
          dequeue(key);
        }
      };

      try {
        item.pending = true;

        const callback = callbacks.get(key);

        if (callback) {
          callback(item, nextAsset);
        }

        const value = await nextAsset.action();

        nextAsset.data = value;
        nextAsset.resolve(value);

        next(nextAsset);
      } catch (e) {
        nextAsset.reject(e);
        next();
      }
    },
    [delayTime],
  );

  const enqueue = useCallback(
    <T>(key: string, action: () => Promise<T>) => {
      return new Promise<T>((resolve, reject) => {
        let item = state.get(key);

        if (!item) {
          item = {
            pending: false,
            assets: [],
          };

          state.set(key, item);
        }

        const asset: Asset<T> = {
          action,
          resolve,
          reject,
        };

        item.assets.push(asset);

        return dequeue(key);
      });
    },
    [dequeue],
  );

  const clear = useCallback((key?: string) => {
    if (key) {
      state.delete(key);
      callbacks.delete(key);
    } else {
      state.clear();
      callbacks.clear();
    }
  }, []);

  return {
    enqueue,
    clear,
    subscribe,
  };
}

export default useQueue;
