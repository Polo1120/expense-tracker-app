import PocketBase from "pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";


const pb = new PocketBase("http://192.168.1.58:8090");

pb.authStore.onChange(async () => {
  try {
    const data = {
      token: pb.authStore.token,
      model: pb.authStore.model,
    };
    await AsyncStorage.setItem("pb_auth", JSON.stringify(data));
  } catch (error) {
    console.error("Error guardando sesión en AsyncStorage:", error);
  }
});

(async () => {
  try {
    const storedAuth = await AsyncStorage.getItem("pb_auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      pb.authStore.save(parsed.token, parsed.model);
    }
  } catch (error) {
    console.error("Error cargando sesión desde AsyncStorage:", error);
  }
})();

export default pb;
