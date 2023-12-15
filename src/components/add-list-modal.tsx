import { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from "react-native";
import { getLists, saveLists } from "../utils/asyncStorage";
import showToast from "../utils/toast";

export default function AddListModal({ visible, closeModal }: { visible: boolean, closeModal: (listname: string | null) => void }) {
  const [listTitle, setListTitle] = useState<string>("");

  const saveList = async () => {
    try {
      const lists = await getLists();
      if (lists != null) {
        lists.push(listTitle);

        await saveLists(lists);
      } else {
        await saveLists([listTitle]);
      }

      closeModal(listTitle);
    } catch (error) {
      showToast({ msg: "Something went wrong try again" })
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.top}>
            <TouchableOpacity onPress={() => closeModal(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.newTaskText}>New List</Text>
            <TouchableOpacity disabled={(listTitle) ? false : true}
              onPress={() => saveList()}>
              <Text style={{ ...styles.addText, color: (listTitle) ? "#0b84ff" : "#403f41" }}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <TextInput placeholder="Shopping List" placeholderTextColor={"#656468"} style={styles.input} 
              value={listTitle} onChangeText={(text) => setListTitle(text)}/>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#2c2c2e",
    padding: 20,
    borderRadius: 10
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cancelText: {
    color: "#0b84ff",
    fontSize: 16
  },
  newTaskText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff"
  },
  addText: {
    fontSize: 16,
    fontWeight: "bold"
  },
  content: {
    marginTop: 20
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});