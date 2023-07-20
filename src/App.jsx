import { Menu } from "./components/Menu/Menu";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [eventData, setEventData] = useState({
    show: false,
  });

  useEffect(() => {
    const eventListener = ({ data }) => {
      if (data.show) {
        setEventData({
          ...eventData,
          show: data.show,
        });
      }
    };

    const handleKeyDown = ({ keyCode }) => {
      if (keyCode === 27) close();
    };

    window.addEventListener("message", eventListener);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("message", eventListener);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  function fetchNui(action, args) {
    const response = args || "nil";
    axios.post("https://endpoint/" + action, JSON.stringify(response)).then((data) => {
      if (data.data.close) close();
    });
  }
  function close() {
    axios.post("https://endpoint/removeFocus").then((data) => {
      if (data.data.closed) setEventData({ ...eventData, show: false });
    });
  }
  return (
    <>
      {eventData.show ? <Menu data={eventData} fetchNui={fetchNui} close={close} /> : ""}
    </>
  );
}
