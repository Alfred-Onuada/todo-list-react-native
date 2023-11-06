import { StyleSheet, View, Text, Pressable, ScrollView, Animated, TouchableOpacity } from "react-native"
import { IPending } from "../interface/pending"
import formatDate from "../utils/formatDate"
import { useEffect, useState } from "react"
import { AntDesign } from '@expo/vector-icons';
import { getData, markAsCompleted } from "../utils/asyncStorage";
import { ITasks } from "../interface/task";
import showToast from "../utils/toast";

export default function Pending({ route, navigation }: { route: any, navigation: any }) {

  const [todos, setTodos] = useState<IPending[]>([]);

  const deleteTodo = (id: number) => {
    setTodos(todos => todos.filter(todo => todo.id !== id))
  }

  useEffect(() => {
    (async () => {
      try {
        const todos = await getData("tasks");

        if (todos != null) {
          if (route.params.type === "today") {
            setTodos(todos.filter((todo: ITasks) => (todo.completed === false && new Date(todo.due).getDate() == new Date(Date.now()).getDate())));
          } else {
            setTodos(todos.filter((todo: ITasks) => todo.completed === false));
          }
        } else {
          setTodos([]);
        }

      } catch (error) {
        showToast({ msg: "Something went wrong try again" })
      }
    })()
  }, [])

  const renderTodo = (todo: IPending) => {
    const colorTransition = new Animated.Value(0); // Initialize the animated value for each todo

    const animateColor = () => {
      Animated.timing(colorTransition, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    };

    const todoIndicatorInnerStyle = {
      width: 20,
      height: 20,
      borderRadius: 20,
      backgroundColor: colorTransition.interpolate({
        inputRange: [0, 1],
        outputRange: ["#00000000", "blue"], // Change colors as needed
      }),
    };

    return (
      <View key={todo.id} style={styles.todo}>
        <Pressable style={styles.todoIndicator} onPress={() => {
          setTimeout(() => {
            markAsCompleted("tasks", todo.id)
            deleteTodo(todo.id);
          }, 120);
          animateColor();
        }}>
          <Animated.View style={[styles.todoIndicatorInner, todoIndicatorInnerStyle]}></Animated.View>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.todoTitle}>{todo.title}</Text>
          <Text style={styles.todoDate}>{todo.notes}</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.todoDate}>Due: </Text>
            <Text style={todo.due < new Date() ? styles.todoDatePast : styles.todoDate}>
              {formatDate(todo.due)}
            </Text>
          </View>
          <View style={styles.smallHR}></View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
        <Text style={styles.title}>{ route.params.type }</Text>
      </View>
      <ScrollView style={{ paddingHorizontal: 15 }}>
        {todos.map(todo => renderTodo(todo))}
      </ScrollView>
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
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#0b84ff',
    marginBottom: 15,
    textTransform: "capitalize"
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
    borderColor: "#46454a",
    borderWidth: 1
  },
  todoIndicatorInner: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  todoTitle: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 3
  },
  todoDate: {
    fontSize: 14,
    color: "#8e8d92",
    marginBottom: 3
  },
  todoDatePast: {
    fontSize: 14,
    color: "#ff4538",
    marginBottom: 3
  },
  smallHR: {
    height: .5,
    backgroundColor: '#8e8d92',
    opacity: .5,
    marginTop: 5
  },
  addTodoContainer: {
    display: "flex",
    flexDirection: 'row',
    padding: 15
  },
  addTodo: {
    marginLeft: 15,
    color: '#0b84ff',
    fontSize: 18,
    fontWeight: 'bold',
  }
})