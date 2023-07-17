const n = 25;
const array = [];
let speed = 60;
let currentAlgorithm = "bubbleSort";

init();

// Audio
let audioCtx = null;

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (
      AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext
    )();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

// Initialize button
function init() {
    const nInput = document.getElementById("nInput");
    const nValue = parseInt(nInput.value);
    if (!isNaN(nValue) && nValue > 0) {
      array.length = 0; // Clear the array
      for (let i = 0; i < nValue; i++) {
        array.push(Math.random());
      }
      showBars();
    } else {
        alert("Please enter a valid positive number for 'n'.");
    }
  }
  

// Play button

function play() {
    const copy = [...array];
    let moves = [];
  
    if (currentAlgorithm === "bubbleSort") {
      moves = bubbleSort(copy);
    } else if (currentAlgorithm === "selectionSort") {
      moves = selectionSort(copy);
    } else if (currentAlgorithm === "mergeSort") {
      mergeSort(copy, 0, copy.length - 1);
      moves = copy.moves;
    } else if (currentAlgorithm === "quickSort") {
      quickSort(copy, 0, copy.length - 1);
      moves = copy.moves;
    }
  
    animate(moves);
  }
  
// Animate
function animate(moves) {
  if (moves.length === 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;

  if (move.type === "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }

  playNote(200 + array[i] * 500);
  playNote(200 + array[j] * 500);

  showBars(move);
  setTimeout(() => {
    animate(moves);
  }, speed);
}

// Change Speed
function changeSpeed(newSpeed) {
    if (newSpeed === "slow") {
    speed = 500;
    } else if (newSpeed === "fast") {
    speed = 2;
    }
    }

// Sorting algorithms

function bubbleSort(array) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      moves.push({ indices: [i - 1, i], type: "comp" });
      if (array[i - 1] > array[i]) {
        swapped = true;
        moves.push({ indices: [i - 1, i], type: "swap" });
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
  } while (swapped);
  return moves;
}

function selectionSort(array) {
  const moves = [];
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      moves.push({ indices: [j, minIndex], type: "comp" });
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      moves.push({ indices: [i, minIndex], type: "swap" });
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  return moves;
}

function mergeSort(array, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSort(array, left, mid);
      mergeSort(array, mid + 1, right);
      merge(array, left, mid, right);
    }
  }
  
  function merge(array, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const leftArr = new Array(n1);
    const rightArr = new Array(n2);
  
    for (let i = 0; i < n1; i++) {
      leftArr[i] = array[left + i];
    }
    for (let j = 0; j < n2; j++) {
      rightArr[j] = array[mid + 1 + j];
    }
  
    let i = 0;
    let j = 0;
    let k = left;
  
    const moves = [];
  
    while (i < n1 && j < n2) {
      moves.push({ indices: [left + i, mid + 1 + j], type: "comp" });
      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      moves.push({ indices: [k], type: "swap" });
      k++;
    }
  
    while (i < n1) {
      array[k] = leftArr[i];
      moves.push({ indices: [k], type: "swap" });
      i++;
      k++;
    }
  
    while (j < n2) {
      array[k] = rightArr[j];
      moves.push({ indices: [k], type: "swap" });
      j++;
      k++;
    }
  
    // Storing the moves in the array parameter
    array.moves = moves;
  }
  
  function quickSort(array, low, high) {
    if (low < high) {
      const pivotIndex = partition(array, low, high);
      quickSort(array, low, pivotIndex - 1);
      quickSort(array, pivotIndex + 1, high);
    }
  }
  
  function partition(array, low, high) {
    const pivot = array[high];
    let i = low;
    const moves = [];
  
    for (let j = low; j < high; j++) {
      moves.push({ indices: [j, high], type: "comp" });
      if (array[j] < pivot) {
        moves.push({ indices: [i, j], type: "swap" });
        [array[i], array[j]] = [array[j], array[i]];
        i++;
      }
    }
    moves.push({ indices: [i, high], type: "swap" });
    [array[i], array[high]] = [array[high], array[i]];
  
    // Storing the moves in the array parameter
    array.moves = moves;
  
    return i;
  }
  

// Change Algorithm
function changeAlgorithm() {
    const selectElement = document.getElementById("algorithmSelect");
    currentAlgorithm = selectElement.value;
  }
// Bars

function showBars(move) {
  const container = document.getElementById("container");
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 170 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}


    
    
