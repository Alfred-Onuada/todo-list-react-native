import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import Category from "../components/category";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from "react";
import { getData } from "../utils/asyncStorage";
import { ITasks } from "../interface/task";
import showToast from "../utils/toast";

type RootStackParamList = {
  Home: undefined;
  Completed: undefined;
  Pending: { type: "all" | "today" };
  Add: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {

  const [todayTasks, setTodayTasks] = useState<number>(0);
  const [allTasks, setAllTasks] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);

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

  navigation.addListener("focus", loadTasks);

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => { navigation.navigate("Pending", { type: "today" }) }}>
          <Category name="Today" count={todayTasks} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("Pending", { type: "all" }) }}>
          <Category name="All" count={allTasks} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("Completed") }}>
          <Category name="Completed" count={completedTasks} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addTodoContainer} onPress={() => { navigation.navigate("Add") }}>
        <AntDesign name="pluscircle" size={24} color="#0b84ff" />
        <Text style={styles.addTodo}>New Task</Text>
      </TouchableOpacity>
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
  }
})