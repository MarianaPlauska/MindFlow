import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-calm-50">
      <Text className="text-2xl font-bold text-serene-700">
        🧠 MindFlow
      </Text>
      <Text className="mt-2 text-neutral-500">
        Your mental health & finance companion
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
