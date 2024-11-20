import { TransactionLocal } from 'config/types';

const LOCAL_STORAGE_KEY = 'wormhole-connect:transactions:inprogress';
const LOCAL_STORAGE_MAX = 3;

// Bigint types cannot be serialized to a string
// That's why we need to provide a replacer function to handle it separately
// Please see for details: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/BigInt_not_serializable
const JSONReplacer = (_, value: any) =>
  typeof value === 'bigint' ? value.toString() : value;

// Retrieves all in-progress transactions from localStorage
export const getTxsFromLocalStorage = ():
  | Array<TransactionLocal>
  | undefined => {
  const ls = window.localStorage;

  // Find the in-progress transactions list in localStorage
  for (let i = 0; i < ls.length; i++) {
    const itemKey = ls.key(i);
    if (itemKey?.toLowerCase() === LOCAL_STORAGE_KEY) {
      const item = ls.getItem(itemKey);
      if (item) {
        try {
          return JSON.parse(item);
        } catch (e: any) {
          // We can get a SyntaxError from JSON.parse
          // In that case we should debug log and remove the local storage entry completely,
          // as we can't know which tx within entry causes the problem without parsing it.
          console.log(
            `Error while parsing localStorage item ${LOCAL_STORAGE_KEY}: ${e}`,
          );
          // Remove item
          ls.removeItem(LOCAL_STORAGE_KEY);
          return;
        }
      }
    }
  }
};

// Adds a TransactionLocal object to localStorage
export const addTxToLocalStorage = (
  data: TransactionLocal, // Item data
) => {
  const ls = window.localStorage;
  const items = getTxsFromLocalStorage();
  let newList: Array<TransactionLocal>;

  if (!items) {
    // First item in the list
    newList = [data];
  } else if (items.length < LOCAL_STORAGE_MAX) {
    // Haven't reached to the max number of items allowed
    // Concat the new item to the end
    newList = items.concat([data]);
  } else {
    // Reached the max number of items allowed
    // Remove the first element and concat the new one to the end
    items.splice(0, 1);
    newList = items.concat([data]);
  }

  // Update the list
  try {
    ls.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList, JSONReplacer));
  } catch (e: any) {
    // We can get two different errors:
    // 1- TypeError from JSON.stringify
    // 2- DOMException from localStorage.setItem
    // In each case, we should debug log and fail silently
    console.log(
      `Error while adding item to localStorage ${LOCAL_STORAGE_KEY}: ${e}`,
    );
  }
};

// Removes a transaction from localStorage
export const removeTxFromLocalStorage = (txHash: string) => {
  const ls = window.localStorage;
  const items = getTxsFromLocalStorage();

  if (items && items.length > 0) {
    // Find the item to remove
    const removeIndex = items.findIndex((tx) => tx.txHash === txHash);
    if (removeIndex > -1) {
      // remove the item and update localStorage
      items.splice(removeIndex, 1);
      try {
        ls.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items, JSONReplacer));
      } catch (e: any) {
        // We can get two different errors:
        // 1- TypeError from JSON.stringify
        // 2- DOMException from localStorage.setItem
        // In each case, we should debug log and fail silently
        console.log(
          `Error while removing item from localStorage ${LOCAL_STORAGE_KEY}: ${e}`,
        );
      }
    }
  }
};

// Updates a specified transaction property in localStorage
export const updateTxInLocalStorage = (
  txHash: string,
  key: string,
  value: any,
) => {
  const ls = window.localStorage;
  const items = getTxsFromLocalStorage();

  if (items && items.length > 0) {
    // Find the item to update
    const idx = items.findIndex((tx) => tx.txHash === txHash);
    if (idx > -1) {
      // Update item property and put back in local storage
      items[idx][key] = value;
      try {
        ls.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items, JSONReplacer));
      } catch (e: any) {
        // We can get two different errors:
        // 1- TypeError from JSON.stringify
        // 2- DOMException from localStorage.setItem
        // In each case, we should debug log and fail silently
        console.log(
          `Error while updating item in localStorage ${LOCAL_STORAGE_KEY}: ${e}`,
        );
      }
    }
  }
};
