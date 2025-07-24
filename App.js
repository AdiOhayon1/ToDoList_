import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  Switch,
} from "react-native";

const STATUS_COLORS_LIGHT = {
  "In Progress": "#4D7CFE",
  "Past Due": "#F08080",
  Completed: "#90EE90",
};

const STATUS_COLORS_DARK = {
  "In Progress": "#4D7CFE",
  "Past Due": "#F08080",
  Completed: "#90EE90",
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Linkedin",
      description: "Upload a post about the task management app",
      status: "In Progress",
      dueDate: "January 3rd, 2025",
    },
    {
      id: "2",
      title: "Finding a job",
      description: "Get a job as a full stack developer",
      status: "Past Due",
      dueDate: "December 29th, 2024",
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // States For edit
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // הוספת משימה חדשה עם תאריך רישום היום
  const addTask = () => {
    if (!newTitle.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }
    const now = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString("en-US", options);

    const newTask = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      status: "In Progress",
      dueDate: formattedDate,
    };
    setTasks([newTask, ...tasks]);
    setNewTitle("");
    setNewDescription("");
    console.log("Tasks after add:", [newTask, ...tasks]);
  };

  //  Remove task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Chaging status 
  const toggleStatus = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const nextStatus =
            task.status === "In Progress"
              ? "Past Due"
              : task.status === "Past Due"
              ? "Completed"
              : "In Progress";
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  // פתיחת מודל העריכה עם הנתונים של המשימה שנבחרה
  const openEditModal = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditModalVisible(true);
  };

  // שמירת העריכה
  const saveEdit = () => {
    if (!editTitle.trim()) {
      Alert.alert("Error", "Title cannot be empty");
      return;
    }
    setTasks(
      tasks.map((task) =>
        task.id === editTaskId
          ? { ...task, title: editTitle, description: editDescription }
          : task
      )
    );
    setEditModalVisible(false);
  };

  const styles = getStyles(darkMode);
  const statusColors = darkMode ? STATUS_COLORS_DARK : STATUS_COLORS_LIGHT;

  // רנדר משימה בודדת
  const renderTask = ({ item }) => (
    <TouchableOpacity
      onPress={() => openEditModal(item)}
      style={[styles.taskContainer, { borderColor: statusColors[item.status] }]}
    >
      <TouchableOpacity
        onPress={() => toggleStatus(item.id)}
        style={styles.statusBadge}
      >
        <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
          {item.status}
        </Text>
      </TouchableOpacity>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.dueDate}>Due {item.dueDate}</Text>
      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Text style={{ fontSize: 18 }}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}> TO DO LIST</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{darkMode ? "🌙" : "🔆"}</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Task Title"
          placeholderTextColor={darkMode ? "#aaa" : "#666"}
          value={newTitle}
          onChangeText={setNewTitle}
          style={[styles.input, darkMode && styles.inputDark]}
        />
        <TextInput
          placeholder="Task Description"
          placeholderTextColor={darkMode ? "#aaa" : "#666"}
          value={newDescription}
          onChangeText={setNewDescription}
          style={[styles.input, darkMode && styles.inputDark]}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Text style={{ color: "white", fontWeight: "bold" }}>+ New Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal עריכה */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              darkMode && styles.modalContainerDark,
            ]}
          >
            <Text style={[styles.modalHeader, darkMode && { color: "white" }]}>
              Edit Task
            </Text>
            <TextInput
              style={[styles.input, darkMode && styles.inputDark]}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              placeholderTextColor={darkMode ? "#aaa" : "#666"}
            />
            <TextInput
              style={[styles.input, darkMode && styles.inputDark]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Description"
              placeholderTextColor={darkMode ? "#aaa" : "#666"}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity onPress={saveEdit} style={styles.saveButton}>
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={{ color: "white" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#222" : "#F5F5F5",
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 30,
    },
    header: {
      fontSize: 24,
      fontFamily: "Georgia",
      fontWeight: "bold",
      color: darkMode ? "white" : "black",
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    switchLabel: {
      marginRight: 8,
      color: darkMode ? "white" : "black",
      fontWeight: "bold",
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      backgroundColor: darkMode ? "#444" : "white",
      borderRadius: 8,
      padding: 12,
      marginVertical: 6,
      color: darkMode ? "white" : "black",
    },
    inputDark: {
      // ניתן להוסיף עיצובים נוספים למצב כהה
    },
    addButton: {
      backgroundColor: "#D8BFD8",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    taskContainer: {
      backgroundColor: darkMode ? "#333" : "white",
      padding: 16,
      borderRadius: 10,
      marginBottom: 12,
      borderLeftWidth: 5,
    },
    statusBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: darkMode ? "#444" : "white",
    },
    statusText: {
      fontWeight: "bold",
      fontSize: 16,
    },
    title: {
      fontWeight: "bold",
      fontSize: 18,
      marginBottom: 4,
      color: darkMode ? "white" : "black",
    },
    description: {
      color: darkMode ? "#ccc" : "#666",
      marginBottom: 8,
    },
    dueDate: {
      fontSize: 12,
      color: darkMode ? "#bbb" : "#999",
    },
    deleteButton: {
      marginTop: 8,
      alignSelf: "flex-end",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    modalContainer: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 12,
      elevation: 5,
    },
    modalContainerDark: {
      backgroundColor: "#444",
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 12,
      color: "black",
    },
    modalButtonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    saveButton: {
      backgroundColor: "#CBAACB",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: "#CBAACB",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
  });
