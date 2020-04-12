let same = 0;
let current_player = -1;
let current_card = 12;
let add_three_cards = 0;
let chosen_cards = [];
let extra_cards = [];
let x = n.length;
let code = [];
let no_set = false;
for (let i = 1; i < 4; i++) {
  for (let j = 1; j < 4; j++) {
    for (let k = 1; k < 4; k++) {
      for (let l = 1; l < 4; l++) {
        code.push(1000 * i + 100 * j + 10 * k + l);
      }
    }
  }
}
for (let i = 0; i < 81; i++) {
  r[i] = code[r[i]];
}
for (let i = 0; i < x; i++) {
  let tr = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  td1.innerHTML = n[i];
  td2.innerHTML = 0;
  td2.setAttribute("id", "score" + i);
  tr.append(td1);
  tr.append(td2);
  $("#board").append(tr);
}
for (let i = 0; i < 81; i++) {
  $("<img/>")[0].src = "/static/img/" + r[i] + ".png";
}
$(document).ready(function () {
  $("#qrcode").qrcode({
    text: window.location.href,
    render: "canvas",
    width: 300,
    height: 300,
  });
  $("#three_more").on("click", function () {
    add_three_cards++;
    let div_row = document.createElement("div");
    div_row.className = "row";
    div_row.setAttribute("id", "seq" + add_three_cards);
    for (let i = 0; i < 3; i++) {
      let label = document.createElement("label");
      label.className = "container_label";
      let input = document.createElement("input");
      input.type = "checkbox";
      input.value = r[current_card + i];
      input.name = "r";
      input.style.display = "inline";
      let div_card = document.createElement("div");
      div_card.className = "card";
      let img = document.createElement("img");
      img.src = "/static/img/" + r[current_card + i] + ".png";
      div_card.append(img);
      label.append(input);
      label.append(div_card);
      div_row.append(label);
    }
    current_card += 3;
    $("#remain").html(81 - current_card);
    let extra_div = document.getElementById("extra_cards");
    extra_div.insertBefore(div_row, extra_div.childNodes[0]);
    $("#seq" + add_three_cards).hide();
    $("#seq" + add_three_cards).slideDown();
    $("label input[type='checkbox']").prop("disabled", true);
    if (current_card > 78) {
      $(this).prop("disabled", true);
    }
    if (no_set) {
      setTimeout(() => {
        find_set() === 0
          ? alert("仍無可能的組合，再抽三張牌")
          : (no_set = false);
      }, 800);
    }
  });
  for (let i = 0; i < n.length; i++) {
    let btn = document.createElement("button");
    btn.innerHTML = n[i];
    btn.setAttribute("id", "btn" + i);
    btn.className = "button";
    $("#players_div").append(btn);
  }
  for (let i = 0; i < 3; i++) {
    let div_row = document.createElement("div");
    div_row.className = "row";
    for (let j = 0; j < 4; j++) {
      let label = document.createElement("label");
      label.className = "container_label";
      let input = document.createElement("input");
      input.type = "checkbox";
      input.value = r[i * 4 + j];
      input.name = "r";
      input.style.display = "inline";
      let div_card = document.createElement("div");
      div_card.className = "card";
      let img = document.createElement("img");
      img.src = "/static/img/" + r[i * 4 + j] + ".png";
      div_card.append(img);
      label.append(input);
      label.append(div_card);
      div_row.append(label);
    }
    $("#cards_div").append(div_row);
  }
  let button_row = document.createElement("div");
  button_row.className = "row";
  let summit_btn = document.createElement("button");
  summit_btn.setAttribute("id", "summit");
  summit_btn.innerHTML = "確認";
  button_row.append(summit_btn);
  $("#cards_div").append(button_row);
  $("label input[type='checkbox']").prop("disabled", true);
  $(".button").on("click", function () {
    $("#three_more").prop("disabled", true);
    $(".button").prop("disabled", true);
    $("#summit").slideDown();
    $("label input[type='checkbox']").prop("disabled", false);
    current_player = $(this).attr("id").slice(-1);
  });
  $(document).on("change", "label input[type='checkbox']", function () {
    if ($("label input[type='checkbox']:checked").length > 3) {
      this.checked = false;
    }
  });
  $("#summit").on("click", function () {
    chosen_cards = $("label input[type='checkbox']:checked")
      .map(function () {
        return $(this).val();
      })
      .get();
    if (!set_or_not(chosen_cards)) {
      alert("失敗QQ");
      let minus = $("#score" + current_player).html();
      minus--;
      $("#score" + current_player).html(minus);
    } else {
      alert("正確！");
      let plus = $("#score" + current_player).html();
      plus++;
      $("#score" + current_player).html(plus);
      if (add_three_cards > 0) {
        rearrange(chosen_cards);
      } else {
        change_cards(chosen_cards);
      }
    }
    current_card < 81 && $("#three_more").prop("disabled", false);
    $("#summit").slideUp();
    $(".button").prop("disabled", false);
    $("label input[type='checkbox']").prop("checked", false);
    $("label input[type='checkbox']").prop("disabled", true);
    setTimeout(() => {
      if (find_set() === 0) {
        alert("沒有可能的組合，請抽三張牌");
        no_set = true;
      }
    }, 1500);
  });
  $("#board_toggle").on("click", function () {
    $(".board_div").slideToggle();
  });
  $("#qrcode_btn").on("click", function () {
    $("#qrcode").slideToggle();
  });
  $("#set_left").on("click", function () {
    alert("有 " + find_set() + " 種可能組合");
  });
  if (find_set() === 0) {
    alert("沒有可能的組合，請抽三張牌");
    no_set = true;
  }
});
function change_cards(chosen_cards) {
  if (current_card > 78) {
    for (let i = 0; i < 3; i++) {
      $("img[src='/static/img/" + chosen_cards[i] + ".png']")
        .parent(".card")
        .css("visibility", "hidden");
      $("input[value='" + chosen_cards[i] + "']").remove();
    }
  } else {
    for (let i = 0; i < 3; i++) {
      $("img[src='/static/img/" + chosen_cards[i] + ".png']")
        .parent(".card")
        .css("visibility", "hidden");
      $("img[src='/static/img/" + chosen_cards[i] + ".png']").attr(
        "src",
        "/static/img/" + r[current_card + i] + ".png"
      );
      $("input[value='" + chosen_cards[i] + "']").attr(
        "value",
        r[current_card + i]
      );
    }
    current_card += 3;
    $("#remain").html(81 - current_card);
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        $("img[src='/static/img/" + r[current_card + i - 3] + ".png']")
          .parent(".card")
          .css("visibility", "visible")
          .hide()
          .fadeIn();
      }
    }, 200);
  }
}
function rearrange(chosen_cards) {
  extra_cards = $("#seq" + add_three_cards + " input[type='checkbox']")
    .map(function () {
      return $(this).val();
    })
    .get();
  for (let i = 0; i < 3; i++) {
    $("img[src='/static/img/" + chosen_cards[i] + ".png']")
      .parent(".card")
      .css("visibility", "hidden");
  }
  var common = $.grep(chosen_cards, function (a) {
    return $.inArray(a, extra_cards) !== -1;
  });
  chosen_cards = $.grep(chosen_cards, function (a) {
    return $.inArray(a, common) === -1;
  });
  extra_cards = $.grep(extra_cards, function (a) {
    return $.inArray(a, common) === -1;
  });
  for (let i = 0; i < extra_cards.length; i++) {
    move(extra_cards[i], chosen_cards[i]);
    $("img[src='/static/img/" + chosen_cards[i] + ".png']").attr(
      "src",
      "/static/img/" + extra_cards[i] + ".png"
    );
    $("input[value='" + chosen_cards[i] + "']").attr("value", extra_cards[i]);
  }
  setTimeout(() => {
    for (let i = 0; i < extra_cards.length; i++) {
      $("img[src='/static/img/" + extra_cards[i] + ".png']")
        .parent(".card")
        .css("visibility", "visible");
    }
    $("#seq" + add_three_cards).slideUp("slow", function () {
      $(this).remove();
    });
    add_three_cards--;
  }, 600);
}
function set_or_not(chosen_cards) {
  let set_or_not;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      let x = j > 1 ? -2 : 1;
      if (
        chosen_cards[j].slice(i, i + 1) === chosen_cards[j + x].slice(i, i + 1)
      ) {
        same++;
      }
    }
    if (same === 1) {
      set_or_not = false;
      same = 0;
      break;
    }
    same = 0;
    if (i === 3) {
      set_or_not = true;
    }
  }
  return set_or_not;
}
function k_combinations(set, k) {
  var i, j, combs, head, tailcombs;
  if (k > set.length || k <= 0) {
    return [];
  }
  if (k == set.length) {
    return [set];
  }
  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }
  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    head = set.slice(i, i + 1);
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}
function find_set() {
  let set_number = 0;
  let all_cards = $("input[type='checkbox']")
    .map(function () {
      return $(this).val();
    })
    .get();
  for (let i = 0; i < k_combinations(all_cards, 3).length; i++) {
    if (set_or_not(k_combinations(all_cards, 3)[i])) {
      set_number++;
    }
  }
  return set_number;
}
function move(ori, des) {
  let rect1 = document
    .querySelector("img[src='/static/img/" + ori + ".png']")
    .closest(".card")
    .getBoundingClientRect();
  let rect2 = document
    .querySelector("img[src='/static/img/" + des + ".png']")
    .closest(".card")
    .getBoundingClientRect();
  $("img[src='/static/img/" + ori + ".png']")
    .parent(".card")
    .animate(
      {
        top: rect2.top - rect1.top,
        left: rect2.left - rect1.left,
      },
      600
    );
}
