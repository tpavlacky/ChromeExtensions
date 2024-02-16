const observer = new MutationObserver(function (mutations, mutationInstance) {
  var hasUpdates = false;

  for (var index = 0; index < mutations.length; index++) {
    var mutation = mutations[index];

    for (let addedNode of mutation.addedNodes) {
      if (addedNode.className == "marketplace-buy-item-card" || addedNode.className == "marketplace-buy-items-list") {
        hasUpdates = true;
        break;
      }
    }
  }

  if (hasUpdates) {
    observer.disconnect();
    run();
    observer.takeRecords();
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }
});

observer.observe(document, {
  childList: true,
  subtree: true
});

function run() {
  const marketItems = document.getElementsByClassName("marketplace-buy-item-card");
  var itemNr = 0;
  if (marketItems.length > 0) {
    for (let item of marketItems) {
      itemNr++;
      calculateRatio(item)
    }
  } else {
    console.warn("No items found");
  }
}

function calculateRatio(item) {
  var itemPriceWrapper = item.querySelector(".item-price-wrapper");
  if(itemPriceWrapper?.classList.contains("ratioCalculated")){
    console.warn("Ratio already calculated");
    return;
  }

  const powerElement = item.querySelector(".item-addition-power");
  if (!powerElement) {
    return;
  }

  const priceElement = item.querySelector(".item-price");
  if (!priceElement) {
    console.error("Price element not found");
    return;
  }

  const power = powerElement.textContent.split("  ");
  const powerValue = power[0];
  const powerUnit = power[1];

  var multiplicator = getMultiplicator(powerUnit);

  if (!multiplicator) {
    console.error(`Uknown unit ${powerUnit}`)
    multiplicator = 1;
  }

  const powerValueNumber = +(powerValue);
  const priceValueNumber = +priceElement.textContent.split(" ")[0];

  if (isNaN(powerValue) || isNaN(priceValueNumber)) {
    console.error("Error during conversion to number");
    return;
  }

  const ratio = ((powerValueNumber * multiplicator) / priceValueNumber).toFixed(2);

  var itemPriceWrapper = item.querySelector(".item-price-wrapper");
  if (!itemPriceWrapper) {
    console.error("No idea where to put ratio");
    return;
  }

  const ratioBadge = document.createElement("p");
  ratioBadge.textContent = `⚖️ Ratio: ${ratio}`;
  ratioBadge.classList.add("item-price");
  ratioBadge.style.color = "#FF0080";
  itemPriceWrapper.insertAdjacentElement("beforeend", ratioBadge);

  itemPriceWrapper.classList.add("ratioCalculated");
}

function getMultiplicator(stringValue) {
  switch (stringValue.toLowerCase()) {
    case "gh/s":
      return 0.001;
    case "th/s":
      return 1;
    case "ph/s":
      return 1000;
  }

  return null;
}