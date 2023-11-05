import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"
import { ICompleted } from "../interface/completed"
import formatDate from "../utils/formatDate"
import { useEffect, useState } from "react";
import { clearCompleted, getData } from "../utils/asyncStorage";
import { ITasks } from "../interface/task";
import showToast from "../utils/toast";

export default function Completed() {

  const [todos, setTodos] = useState<ICompleted[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const todos = await getData("tasks");

        if (todos != null) {
          setTodos(todos
            .filter((todo: ITasks) => todo.completed === true)
            .map((todo: ITasks): ICompleted => ({
              completed: todo.completedOn ? todo.completedOn : new Date(Date.now()),
              date: todo.due,
              id: todo.id,
              title: todo.title
            }))
          );
        } else {
          setTodos([]);
        }
      } catch (error) {
        showToast({ msg: "Something went wrong try again" })
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <View style={{ padding: 15 }}>
        <Text style={styles.title}>Completed</Text>
        <View style={styles.topExtra}>
          <Text style={styles.countText}>{todos.length} Completed</Text>
          <View style={styles.dot}></View>
          <TouchableOpacity onPress={() => { 
            clearCompleted("tasks");
            setTodos([]);
          }} disabled={todos.length > 0 ? false : true}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.hr}></View>
      <ScrollView style={{ padding: 15 }}>
        {todos.map(todo => (
          <View key={todo.id} style={styles.todo}>
            <View style={styles.todoIndicator}>
              <View style={styles.todoIndicatorInner}></View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.todoTitle}>{ todo.title }</Text>
              <Text style={styles.todoDate}>Due: { formatDate(todo.date) }</Text>
              <Text style={styles.todoDate}>Completed: { formatDate(todo.completed) }</Text>
              <View style={styles.smallHR}></View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#6f7e89',
    marginBottom: 15
  },
  topExtra: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  clearText: {
    color: '#0b84ff',
    fontSize: 16
  },
  countText: {
    color: "#8e8d92",
    fontSize: 16,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#8e8d92',
    marginHorizontal: 10
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: '#8e8d92',
    opacity: .5
  },
  todo: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 15
  },
  todoIndicator: {
    padding: 2,
    width: 24,
    height: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
    borderColor: "#6f99bf",
    borderWidth: 1
  },
  todoIndicatorInner: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#6f99bf"
  },
  todoTitle: {
    fontSize: 18,
    color: "#8e8d92",
    marginBottom: 3
  },
  todoDate: {
    fontSize: 14,
    color: "#8e8d92",
    marginBottom: 3
  },
  smallHR: {
    height: .5,
    backgroundColor: '#8e8d92',
    opacity: .5,
    marginTop: 5
  }
})