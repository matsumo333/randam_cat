import { NextPage } from "next";
import { useEffect, useState } from "react";

const IndexPage: NextPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); // タイマーの状態を保持するステート

  useEffect(() => {
    // コンポーネントがマウントされた直後に最初の画像を読み込む
    fetchNewImage();

    // cleanup functionを使って、コンポーネントがアンマウントされる時にタイマーをクリアする
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  // 新しい画像を取得する関数
  const fetchNewImage = async () => {
    setLoading(true); // 読込中フラグを立てる
    const newImage = await fetchImage();
    setImageUrl(newImage.url); // 画像URLの状態を更新する
    setLoading(false); // 読込中フラグを倒す
  };

  // ボタンをクリックしたときに新しい画像を取得し、タイマーをクリアする関数
  const handleClick = () => {
    clearIntervalTimer(); // タイマーをクリア
    fetchNewImage(); // 新しい画像を取得
  };

  // タイマーをセットする関数
  const setUpdateTimer = () => {
    const newTimer = setInterval(fetchNewImage, 5000); // 3秒ごとに新しい画像を取得するタイマーをセット
    setTimer(newTimer); // タイマーをステートに保存
  };

  // タイマーをクリアする関数
  const clearIntervalTimer = () => {
    if (timer) {
      clearInterval(timer); // タイマーをクリア
      setTimer(null); // タイマーのステートをクリア
    }
  };

  // コンポーネントがマウントされた直後にタイマーをセット
  useEffect(() => {
    if (!timer) {
      setUpdateTimer();
    }

    // cleanup functionを使って、コンポーネントがアンマウントされる時にタイマーをクリアする
    return clearIntervalTimer;
  }, [timer]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <button onClick={handleClick} style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
        新しい画像を取得
      </button>
      <div style={{ position: "relative" }}>
        {loading || <img src={imageUrl} style={{ maxWidth: "100%", maxHeight: "100%" }} />}
      </div>
    </div>
  );
};

export default IndexPage;

type Image = {
  url: string;
};

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  return images[0];
};
