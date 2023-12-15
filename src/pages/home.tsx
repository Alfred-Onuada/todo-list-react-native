import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import Category from "../components/category";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from "react";
import { getData, getLists } from "../utils/asyncStorage";
import { ITasks } from "../interface/task";
import showToast from "../utils/toast";
import AddListModal from "../components/add-list-modal";

type RootStackParamList = {
  Home: undefined;
  Completed: undefined;
  Pending: { type: "all" | "today" };
  custom: { listName: string };
  Add: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface ICustomLists {
  name: string;
  count: number;
}

export default function Home({ navigation }: Props) {

  const [todayTasks, setTodayTasks] = useState<number>(0);
  const [allTasks, setAllTasks] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [showAddListModal, setShowAddListModal] = useState<boolean>(false);
  const [customLists, setCustomLists] = useState<ICustomLists[]>([]);

  const loadTasks = async () => {
    try {
      const todos = await getData("tasks");

      if (todos != null) {
        setTodayTasks(todos.filter((todo: ITasks) => (todo.completed === false && new Date(todo.due).getDate() == new Date(Date.now()).getDate())).length);
        setAllTasks(todos.filter((todo: ITasks) => todo.completed === false).length);
        setCompletedTasks(todos.filter((todo: ITasks) => todo.completed === true).length);
      }
    } catch (error: any) {
      showToast({ msg: "Something went wrong try again" })
    }
  }

  useEffect(() => {
    (async () => {
      const lists = await getLists();

      if (lists != null) {
        const myCustomList = [];

        for (let i = 0; i < lists.length; i++) {
          const todos = await getData(lists[i]);

          if (todos != null) {
            myCustomList.push({ name: lists[i], count: todos.length });
          } else {
            myCustomList.push({ name: lists[i], count: 0 });
          }
        }

        setCustomLists(myCustomList);
      }
    })();
  }, []);

  navigation.addListener("focus", loadTasks);

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => { navigation.navigate("Pending", { type: "today" }) }}>
          <Category name="Today" count={todayTasks} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("Pending", { type: "all" }) }}>
          <Category name="All" count={allTasks} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("Completed") }}>
          <Category name="Completed" count={completedTasks} />
        </TouchableOpacity>

        {/* Custom Lists */}
        {customLists.map((list: ICustomLists, index: number) => (
          <TouchableOpacity key={index} onPress={() => { navigation.navigate("custom", { listName: list.name }) }}>
            <Category name={list.name} count={list.count} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.addTodoContainer} onPress={() => { navigation.navigate("Add") }}>
          <AntDesign name="pluscircle" size={24} color="#0b84ff" />
          <Text style={styles.addTodo}>New Task</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowAddListModal(true)}>
          <Text style={styles.addList}>Add List</Text>
        </TouchableOpacity>
      </View>

      <AddListModal visible={showAddListModal} closeModal={(listName) => {
        if (listName == null) {
          setShowAddListModal(false)
          return;
        }

        const newList = [...customLists, { name: listName, count: 0 }];
        setCustomLists(newList);
        setShowAddListModal(false)
      }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 15
  },
  addTodoContainer: {
    display: "flex",
    flexDirection: 'row',
  },
  addTodo: {
    marginLeft: 15,
    color: '#0b84ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addList: {
    color: '#0b84ff',
    fontSize: 18,
    fontWeight: 'normal',
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  }
})