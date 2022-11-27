console.log("Working");

// Config

const Config = {
    CheckerAPIURL: "https://dirty.npkn.net/paranoid-domain-checker", // API URL used for domain name checking
    DomainsToCheck: "com,net,org,com.au,io,xyz,pro,live,meme"
}

// Main

function main() {
    let resultsRaw = document.getElementById("results");
    let exampleResultRaw = document.getElementById("exampleResult")
    exampleResultRaw.parentElement.removeChild(exampleResultRaw);

    $("#search").on("keyup", (event) => {
        if (event.which != 13) { return; }

        $(resultsRaw).empty();

        let toCheck = $("#search").val()
        toCheck = encodeURIComponent(toCheck);
        toCheck = toCheck.split(".")[0];
        if (toCheck.length <= 0) {
            $("#news").text("Invalid input! Try again!");
            return;
        }
        $("#news").text("Checking...");

        let toCheckURL = `${Config.CheckerAPIURL}?${toCheck}=${Config.DomainsToCheck}`;
        console.log("Getting...")
        fetch(toCheckURL).then((response) => {
            response.json().then((data) => {
                let avaliable = data.avaliable;
                if ((!avaliable) || avaliable.length <= 0) {
                    $("#news").text(`Bad news! No domains were found at all starting with '${toCheck}'!`);
                    return;
                }

                $("#news").text(`Good news! There were domains found starting with '${toCheck}'!`);
                for (let a in avaliable) {
                    let domain = avaliable[a];
                    let resultClone = exampleResultRaw.cloneNode(true);
                    $(resultClone).prop("id", `result_${domain}`);
                    $(resultClone).text(domain);
                    resultsRaw.appendChild(resultClone);
                }
            })
        });
    });
}

$(document).ready(main);
