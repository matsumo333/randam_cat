import { NextPage } from "next";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import styles from "./index.module.css";// CSSファイルのインポート


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
    <div className={styles.container}>
    {/* <button onClick={handleClick} className={styles.button}>
      新しい画像を取得
    </button> */}
    <div className={styles.imageContainer}>
      {loading ? <LoadingSpinner /> : <img src={imageUrl} className={styles.image} />}
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
