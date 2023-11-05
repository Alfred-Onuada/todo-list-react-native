import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StyleSheet, StatusBar as rnStatusBar, View, Text } from 'react-native';
import Home from './src/pages/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Completed from './src/pages/completed';
import Pending from './src/pages/pending';
import AddTask from './src/components/add-task';

const Stack = createNativeStackNavigator();

const CustomHeaderTitle = () => (
  <View style={{ width: '100%' }}>
    <Text style={{ fontSize: 18, color: '#0b84ff', textAlign: "left" }}>Lists</Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTitle: props => <CustomHeaderTitle />,
        }}>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Completed" component={Completed} options={{ headerShown: true }} />
          <Stack.Screen name="Pending" component={Pending} options={{ headerShown: true }} />
          <Stack.Screen name="Add" component={AddTask} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? rnStatusBar.currentHeight : 0,
    backgroundColor: "#000000"
  },
});
