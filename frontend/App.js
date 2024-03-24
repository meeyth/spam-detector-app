import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";

import axios from "axios";
import { StatusBar } from "expo-status-bar";

const { height, width } = Dimensions.get("screen");

const baseUrl = "http://192.168.0.181:80";

export default function App() {
  const [message, setMessage] = useState("");
  const [isSpam, setIsSpam] = useState(null);
  // console.log(message);

  const onPredict = async () => {
    const url = `${baseUrl}/api/predict`;

    // console.log(url);

    try {
      const res = await axios.post(url, { message });
      // console.log(res.data?.prediction);

      if (res.data.prediction == 0) setIsSpam(false);
      else if (res.data.prediction == 1) setIsSpam(true);
      else setIsSpam(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View className="flex-1 items-center  bg-[#181a20] ">
        <View
          className="h-28 bg-[#8f87dc] my-16 justify-center  mx-4 px-5 rounded-3xl"
          style={{ width: width * 0.9 }}
        >
          <Text className="text-2xl text-white font-bold mb-2">
            Spam Message Detector
          </Text>
          <Text className="text-sm text-white ">
            Enter a text message and the model will predict if the message is a
            spam or not
          </Text>
        </View>
        <TextInput
          className="bg-[#1C202B] h-32 rounded-lg  text-lg p-5 text-gray-50 "
          cursorColor={"#8f87dc"}
          placeholder="Enter your message here"
          placeholderTextColor={"gray"}
          style={{ width: width * 0.9, textAlignVertical: "top" }}
          onChangeText={setMessage}
          value={message}
          multiline
        />

        {isSpam != null ? (
          <TouchableOpacity
            className="h-20 my-5 justify-center items-center mx-4 px-5 rounded-full absolute top-80 z-10 shadow-white shadow-lg"
            style={{
              width: width * 0.55,
              backgroundColor: isSpam ? "#ee2266" : "#7733ff",
            }}
            onPress={() => setIsSpam(null)}
          >
            <Text className="text-2xl text-white font-bold mb-2">
              {isSpam == true ? "Spam!" : "Not Spam"}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View className="flex-row my-10">
          <TouchableOpacity
            className="h-12 bg-[#1C202B]  justify-center items-center mx-4  shadow-md shadow-[#8f87dc] rounded-2xl "
            style={{ width: width * 0.4 }}
            onPress={() => {
              setMessage("");
            }}
          >
            <Text
              className="text-2xl text-white font-bold h-full w-full"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              Clear
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-12 bg-[#8f87dc]  justify-center items-center mx-4  shadow-md shadow-[#7733ff] rounded-2xl "
            style={{ width: width * 0.4 }}
            onPress={onPredict}
          >
            <Text
              className="text-2xl text-gray-50 font-bold h-full w-full"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              Predict
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </>
  );
}
