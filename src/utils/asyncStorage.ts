import AsyncStorage from '@react-native-async-storage/async-storage';
import { ITasks } from '../interface/task';

export function getData(key: string): Promise<ITasks[] | null> {
  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.getItem(key)
        .then((value) => {
          if (value !== null) {
            resolve(JSON.parse(value));
          } else {
            resolve(null);
          }
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

export function storeData(key: string, value: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.setItem(key, JSON.stringify(value));

      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};

export function markAsCompleted(key: string, todoId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.getItem(key)
        .then((value) => {
          if (value !== null) {
            const tasks = JSON.parse(value);

            const updatedTasks = tasks.map((task: ITasks) => {
              if (task.id === todoId) {
                task.completed = true;
                task.completedOn = new Date();
              }

              return task;
            });

            AsyncStorage.setItem(key, JSON.stringify(updatedTasks));

            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

export function clearCompleted(key: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.getItem(key)
        .then((value) => {
          if (value !== null) {
            const tasks = JSON.parse(value);

            const updatedTasks = tasks.filter((task: ITasks) => !task.completed);

            AsyncStorage.setItem(key, JSON.stringify(updatedTasks));

            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}