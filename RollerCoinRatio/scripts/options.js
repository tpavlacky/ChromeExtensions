const saveOptions = () => {
  console.log("saving")
  const range1 = document.getElementById('color1').value;
  const range2 = document.getElementById('color2').value;
  const range3 = document.getElementById('color3').value;
  const range4 = document.getElementById('color4').value;
  const range5 = document.getElementById('color5').value;
  
  console.log(range1);

  chrome.storage.sync.set(
    { range1: range1, 
      range2: range2,
      range3: range3,
      range4: range4,
      range5: range5 
    },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 3000);
    }
  );
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    { range1: "#FF0080", 
      range2: "#FF0080",
      range3: "#FF0080",
      range4: "#FF0080",
      range5: "#FF0080" 
    },
    (items) => {
      document.getElementById('color1').value = items.range1;
      document.getElementById('color2').value = items.range2;
      document.getElementById('color3').value = items.range3;
      document.getElementById('color4').value = items.range4;
      document.getElementById('color5').value = items.range5;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);