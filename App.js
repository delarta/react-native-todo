import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckBox from "expo-checkbox";

function TodoScreen({}) {
  const [isLoading, setIsloading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodos] = useState("");

  const addTodo = () => {
    setTodos((prev) => [
      { title: newTodo, id: Date.now(), userId: 1, completed: false },
      ...prev,
    ]);
    setNewTodos("");
  };

  const deleteTodo = (id) => {
    const excludeIdGiven = [...todos.filter((item) => item.id !== id)];
    setTodos(excludeIdGiven);
  };

  const toggleCompletedTodo = (id, newVal) => {
    const findTodo = [
      ...todos.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            completed: newVal,
          };
        }
        return item;
      }),
    ];
    setTodos(findTodo);
  };

  const getTodoList = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1/todos"
      );
      const json = await response.json();
      setTodos(json.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <View style={styles.detailScreen}>
      <View style={{ paddingBottom: 8, width: "100%" }}>
        <Text style={{ textAlign: "left" }}>
          You Have {todos.filter((item) => !item.completed).length} unfinished
          task
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputText}>
          <TextInput
            value={newTodo}
            style={{ height: 34, backgroundColor: "#ffffff" }}
            placeholder="Add todo list"
            onChangeText={(newText) => {
              setNewTodos(newText);
            }}
          />
        </View>
        <View>
          <Button
            style={{ height: 44 }}
            onPress={() => addTodo()}
            title="Add Todo"
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <SafeAreaView style={{ width: "100%", paddingTop: 8 }}>
          <FlatList
            data={todos}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 8,
                    gap: 8,
                  }}
                >
                  <CheckBox
                    disabled={false}
                    value={item.completed}
                    onValueChange={(newValue) =>
                      toggleCompletedTodo(item.id, newValue)
                    }
                  />
                  <Text
                    style={{
                      textDecorationLine: item.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {item.title.slice(0, 20)}
                    {item.title.length > 20 ? "..." : null}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 8,
                    gap: 8,
                  }}
                >
                  <Button
                    title="delete"
                    color="red"
                    onPress={() => deleteTodo(item.id)}
                  />
                </View>
              </View>
            )}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={TodoScreen}
          options={{ title: "My Task" }}
        />
        {/* <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="Todo" component={TodoScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
  },
  homescreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  detailScreen: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  inputText: {
    height: 36,
    borderWidth: 1,
    borderColor: "#dfdfdf",
    flex: 1,
    paddingLeft: 16,
    backgroundColor: "#ffffff",
  },
});
