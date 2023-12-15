import { StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { getData, getLists, storeData } from "../utils/asyncStorage";
import { ITasks } from "../interface/task";
import showToast from "../utils/toast";

export default function AddTask({ navigation }: { navigation: any }) {
  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const [minDate, setMinDate] = useState(new Date(Date.now()));
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskNotes, setTaskNotes] = useState<string>("");
  const [category, setCategory] = useState<string | undefined>();
  const [customLists, setCustomLists] = useState<string[]>();

  useEffect(() => {
    // get the customLists
    (async () => {
      const lists = await getLists();

      if (lists != null) {
        setCustomLists(lists);
      }
    })();
  }, []);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const saveTodo = async () => {
    try {
      // read todo from cache update cache and navigate to home
      const newTodo: ITasks = {
        id: Math.floor(Math.random() * 1000000) + 1,
        title: taskTitle,
        notes: taskNotes,
        due: date,
        completed: false,
        completedOn: null,
        customList: category
      };
  
      const tasks = await getData("tasks");
      if (tasks != null) {
        tasks.push(newTodo);
        await storeData("tasks", tasks);
      } else {
        await storeData("tasks", [newTodo]);
      }

      navigation.navigate("Home");
    } catch (error) {
      showToast({ msg: "Something went wrong try again" })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.newTaskText}>New Task</Text>
        <TouchableOpacity disabled={(taskTitle && taskNotes && date) ? false : true}
          onPress={() => saveTodo()}>
          <Text style={{ ...styles.addText, color: (taskTitle && taskNotes && date) ? "#0b84ff" : "#403f41" }}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <TextInput placeholder="Title" placeholderTextColor={"#656468"} style={styles.input} 
          value={taskTitle} onChangeText={(text) => setTaskTitle(text)}/>
        <View style={styles.hl}></View>
        <TextInput placeholder="Notes" placeholderTextColor={"#656468"} style={styles.inputLarge}
          multiline value={taskNotes} onChangeText={(text) => setTaskNotes(text)}/>
      </View>
      <View style={{ ...styles.content, ...styles.timeContent }}>
        <Text style={styles.dueText}>Due Date & Time</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"datetime"}
          onChange={onChange}
          minimumDate={minDate}
          themeVariant="dark"
        />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 15
  },
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cancelText: {
    fontSize: 20,
    color: "#0b84ff"
  },
  newTaskText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "600"
  },
  addText: {
    fontSize: 20,
    fontWeight: "600"
  },
  content: {
    backgroundColor: "#2c2c2e",
    padding: 10,
    marginTop: 20,
    borderRadius: 10
  },
  input: {
    fontSize: 18,
    color: "#ffffff"
  },
  inputLarge: {
    fontSize: 18,
    height: 200,
    color: "#ffffff"
  },
  hl: {
    marginVertical: 10,
    width: "100%",
    height: 1,
    backgroundColor: "#353437",
  },
  timeContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dueText: {
    fontSize: 18,
    color: "#ffffff"
  }
});