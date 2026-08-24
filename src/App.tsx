import "./App.css";
import React, { useState } from 'react';
import { products as initialProducts } from "./products";

function getDays(year: number, month: number) {
  // 月の最終日の日付を取得する
  const lastDate = new Date(year, month, 0);
  // lastDateから月の最終日が何日かを取得する
  const lastDay = lastDate.getDate();

  // その月の1日からlastDay日までを扱う配列
  // Date(...)は月を0～11で扱うため、-1して渡す
  const days = Array.from({ length: lastDay}, (_, i) => new Date(year, month - 1, i + 1));
  return days;
}

function getBlankCells(year: number, month: number) {
  // 選択した月の1日を取得
  const firstDate = new Date(year, month - 1, 1);
  // firstDateが何曜日かを取得 (0:日, 1:月, 2:火, 3:水, 4:木, 5:金, 6:土)
  const firstWeekday = firstDate.getDay();
  // firstWeekday個の空白セルを作成するための配列
  // 例えば「firstWeekday = 3」で水曜日なら「日、月、火」で3個となる
  const blankCells = Array.from({length: firstWeekday}, (_, i) => i);

  return blankCells;
}

function getDiffDays(expiryDate: Date, today: Date) {
  // ミリ秒計算なので、1000ミリ秒*60秒*60分*24時間で補正して日単位で計算している
  const diffDays = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays;
}

function getProductColor(diffDays: number) {
   // 商品のデフォルトの文字色は黒
  let productColor = "black";
  // 賞味期限までの日数に応じて警告色を段階的に変更する
  if (diffDays <= 0) {           // 当日か賞味期限切れは赤
    productColor = "red";
  } else if (diffDays <= 3) {   // 3日以内はオレンジ
    productColor = "orange";
  } else if (diffDays <= 7) {   // 7日以内は黄色
    productColor = "yellow";
  }

  return productColor;
}

type DateSelectorProps = {
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  thisYear: number;
  nextYear: number;
  months: number[];
};

function DateSelector({
  // 親Reactコンポーネントが持つ値を使用する場合は、propsとして受け取る
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
  thisYear,
  nextYear,
  months
}: DateSelectorProps) {

  return (
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
  )
}

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

  const days = getDays(selectedYear, selectedMonth);
  const blankCells = getBlankCells(selectedYear, selectedMonth);

  // 1~12までの月一覧を扱う配列
  const months = Array.from({ length: 12}, (_, i) => i+1);

  // 今日の0:00:00を取得
  const todayAtMidnight = new Date (
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // useStateは、値を状態として保持し、値が変更されたときに画面を再描画するためのReactの機能
  // productsは「現在の商品データ」、setProductsは「商品データを更新する関数」
  // useState()は[現在の値, 値を更新する関数]を返すから、配列の分割代入でproductsとsetProductsとして受け取る

    /*
      【分割代入とは】
      ◆配列の分割代入
      例えば、次のように配列の要素を個別の変数へ一度に代入できる構文のこと。
      const array = [1, 2, 3];
      const [a, b, c] = array;
      console.log(a); // 1
      console.log(b); // 2
      console.log(c); // 3

      ◆スプレッド構文を使った配列の分割代入
      配列の最初の要素を個別の変数に代入し、残りの要素を別の配列としてまとめて取得することもできる。
      const array = [1, 2, 3];
      const [num1, ...other] = array;
      console.log(num1); // 1
      console.log(other); // [2, 3]

      ◆オブジェクトの分割代入
      オブジェクトのプロパティを個別の変数に代入することができる。
      const obj = { name: "Taro", age: 25 };
      const { name, age } = obj;
      console.log(name); // "Taro"
      console.log(age); // 25

      ◆関数の引数における分割代入
      関数の引数としてオブジェクトを受け取る際に、分割代入を使って個別の変数として扱うことができる。
      function greet({ name, age }) {
        console.log(`Hello, ${name}! You are ${age} years old.`);
      }
      const person = { name: "Taro", age: 25 };
      greet(person); // "Hello, Taro! You are 25 years old."
    */
   
  // import { products as initialProducts } from "./products";で、products.tsをinitialProductsとしてインポートしている
  const [products, setProducts] = useState(initialProducts);

  // 新しく追加する商品名と賞味期限を保持するstate
  // useState("")で初期値が空文字のstateを作成している
  // useState("")も[現在の値, 値を更新する関数]を返すので、分割代入でnewProductNameとsetNewProductNameとして受け取る
  const [newProductName, setNewProductName] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("");

  function addProduct() {
    const newProduct = {
      name: newProductName,
      expiryDate: new Date(newExpiryDate),
    };

    setProducts([...products, newProduct]);
    setNewProductName("");
    setNewExpiryDate("");
  }

  return (
    <div>
      <h1 style={{color: "black"}}>賞味期限管理アプリ</h1>
      <DateSelector
        // props名 = {App側の変数名}
        selectedYear = {selectedYear}
        selectedMonth = {selectedMonth}
        setSelectedYear = {setSelectedYear}
        setSelectedMonth = {setSelectedMonth}
        thisYear = {thisYear}
        nextYear = {nextYear}
        months = {months}
      />

      <h2 style={{color: "black"}}>{selectedYear}年 {selectedMonth}月</h2>

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
                const diffDays = getDiffDays(
                  product.expiryDate, todayAtMidnight
                );

                const productColor = getProductColor(diffDays);

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