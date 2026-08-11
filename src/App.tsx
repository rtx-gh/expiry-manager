import "./App.css";
import { useState } from 'react';

function App() {
  const today = new Date();
  const thisYear = today.getFullYear();
  const nextYear = today.getFullYear() + 1;
  // 選択可能な最初の年
  // const startYear = thisYear - 20;
  // 選択可能な最後の年
  // const endYear = thisYear + 20;
  const [selectedYear, setSelectedYear] = useState(thisYear);
  // getMonth()は0～11を返すため、+1して1～12に補正する
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  // 月の最終日の日付を取得する
  // ここは翌月の0日(当月の最終日)なのでselectedMonth - 1ではない
  const lastDate = new Date(selectedYear, selectedMonth, 0);
  // lastDateから月の最終日が何日かを取得する
  const lastDay = lastDate.getDate();

  // その月の1日からlastDay日までを扱う配列
  // Date(...)は月を0～11で扱うため、-1して渡す
  const days = Array.from({ length: lastDay}, (_, i) => new Date(selectedYear, selectedMonth - 1, i + 1));
  // 1~12までの月一覧を扱う配列
  const months = Array.from({ length: 12}, (_, i) => i+1);

  // 選択した月の1日を取得
  const firstDate = new Date(selectedYear, selectedMonth - 1, 1);
  // firstDateが何曜日かを取得 (0:日, 1:月, 2:火, 3:水, 4:木, 5:金, 6:土)
  const firstWeekday = firstDate.getDay();
  // firstWeekday個の空白セルを作成するための配列
  // 例えば「firstWeekday = 3」で水曜日なら「日、月、火」で3個となる
  const blankCells = Array.from({length: firstWeekday}, (_, i) => i);

  // 今日の0:00:00を取得
  const todayAtMidnight = new Date (
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [products, setProducts] = useState([
    // 7月分
    { name: "牛乳", expiryDate: new Date(2026, 6, 2) },
    { name: "ウィンナー", expiryDate: new Date(2026, 6, 4) },
    { name: "ベーコン", expiryDate: new Date(2026, 6, 6) },
    { name: "ハム", expiryDate: new Date(2026, 6, 7) },
    { name: "豚肉", expiryDate: new Date(2026, 6, 9) },
    { name: "鶏もも肉", expiryDate: new Date(2026, 6, 11) },
    { name: "鶏むね肉", expiryDate: new Date(2026, 6, 13) },
    { name: "ひき肉", expiryDate: new Date(2026, 6, 14) },
    { name: "スライスチーズ", expiryDate: new Date(2026, 6, 16) },
    { name: "ヨーグルト", expiryDate: new Date(2026, 6, 18) },
    { name: "バター", expiryDate: new Date(2026, 6, 19) },
    { name: "生クリーム", expiryDate: new Date(2026, 6, 21) },
    { name: "豆腐", expiryDate: new Date(2026, 6, 22) },
    { name: "納豆", expiryDate: new Date(2026, 6, 24) },
    { name: "キムチ", expiryDate: new Date(2026, 6, 26) },
    { name: "めかぶ", expiryDate: new Date(2026, 6, 27) },
    { name: "そば", expiryDate: new Date(2026, 6, 28) },
    { name: "うどん", expiryDate: new Date(2026, 6, 29) },
    { name: "焼きそば", expiryDate: new Date(2026, 6, 30) },
    { name: "ラーメン", expiryDate: new Date(2026, 6, 31) },

    // 8月分
    { name: "牛乳", expiryDate: new Date(2026, 7, 1) },
    { name: "ウィンナー", expiryDate: new Date(2026, 7, 3) },
    { name: "ベーコン", expiryDate: new Date(2026, 7, 5) },
    { name: "ハム", expiryDate: new Date(2026, 7, 8) },
    { name: "豚肉", expiryDate: new Date(2026, 7, 10) },
    { name: "鶏もも肉", expiryDate: new Date(2026, 7, 12) },
    { name: "鶏むね肉", expiryDate: new Date(2026, 7, 13) },
    { name: "ひき肉", expiryDate: new Date(2026, 7, 15) },
    { name: "スライスチーズ", expiryDate: new Date(2026, 7, 16) },
    { name: "ヨーグルト", expiryDate: new Date(2026, 7, 18) },
    { name: "バター", expiryDate: new Date(2026, 7, 20) },
    { name: "生クリーム", expiryDate: new Date(2026, 7, 21) },
    { name: "豆腐", expiryDate: new Date(2026, 7, 23) },
    { name: "納豆", expiryDate: new Date(2026, 7, 24) },
    { name: "キムチ", expiryDate: new Date(2026, 7, 25) },
    { name: "めかぶ", expiryDate: new Date(2026, 7, 27) },
    { name: "そば", expiryDate: new Date(2026, 7, 28) },
    { name: "うどん", expiryDate: new Date(2026, 7, 29) },
    { name: "焼きそば", expiryDate: new Date(2026, 7, 30) },
    { name: "ラーメン", expiryDate: new Date(2026, 7, 31) },
  ]);

  // 商品追加機能に使用予定
  // const [newProductName, setNewProductName] = useState("");
  // const [newExpiryDate, setNewExpiryDate] = useState("");
  
  return (
    <div>
      <h1 style={{color: "black"}}>賞味期限管理アプリ</h1>
      <div>
        <select
          value={selectedYear}
          onChange={(event) => {
            // Number()で「string型のevent.target.value」->「number型のsetSelectedYear」に変換して型エラーを防いでいる
            setSelectedYear(Number(event.target.value));
          }}>
          <option>{thisYear}</option>
          <option>{nextYear}</option>
        </select>年

        <select
          value={selectedMonth}
          onChange={(event) => {
            setSelectedMonth(Number(event.target.value));
          }}>
            {months.map((month) => (
              <option
                key={month}
                value={month}
              >
                {month}
              </option>
          ))}
        </select>月
      </div>

      <h2 style={{color: "black"}}>{selectedYear}年 {selectedMonth}月</h2>
      <h2 style={{color: "black"}}>{firstWeekday}日</h2>

      <div className="calendar-grid">
        {["日", "月", "火", "水", "木", "金", "土"].map((weekday) => (
          <div 
            className="weekday-cell"
            key={weekday}>{weekday}</div>
        ))}

        {blankCells.map((blank) => (
          <div
            className="calendar-cell"
            key={`blank-${blank}`}
          >
          </div>
        ))}

        {days.map((day) => (
          // getTime()はdayから日付を時刻0:00:00の日付として返す
          <div
            className="calendar-cell"
            key={day.getTime()}
          >
            {day.getDate()}
            {products
              // 賞味期限と日付を比較
              .filter((product) => (
                product.expiryDate.getTime() === day.getTime()
              ))
              // 実際に商品名を表示
              .map((product) => {
                // ミリ秒計算なので、1000ミリ秒*60秒*60分*24時間で補正して日単位で計算している
                const diffDays = (product.expiryDate.getTime() - todayAtMidnight.getTime()) / (1000 * 60 * 60 * 24);

                // 商品のデフォルトの文字色は黒
                let productColor = "black";
                // 賞味期限までの日数に応じて警告色を段階的に変更する
                if (diffDays < 0) {           // 当日か賞味期限切れは赤
                  productColor = "red";
                } else if (diffDays <= 3) {   // 3日以内はオレンジ
                  productColor = "orange";
                } else if (diffDays <= 7) {   // 7日以内は黄色
                  productColor = "yellow";
                }

                return (
                  <div
                    key={product.name}
                    style={{
                      color: productColor,
                      textShadow:
                      productColor !== "black"
                        ? "1px 1px 2px black"   // ?はtrueのとき
                        : "none",               // :はfalseのとき
                    }}
                  >
                    {product.name}
                  </div>
                )
              })
            }
          </div>))}
      </div>
    </div>
  );
}

export default App;