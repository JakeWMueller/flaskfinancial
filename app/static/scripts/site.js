var Site = function () {
    this.symbol = "AAPL";
};

Site.prototype.Init = function () {
    this.GetQuote();
    $("#symbol").on("click", function () {
        $(this).val("");
    });
};

Site.prototype.GetQuote = function () {
    var that = this;
    $.ajax({
        url: "/quote?symbol=" + that.symbol,
        method: "GET",
        cache: false
    }).done(function (data) {
        var context = {};
        context.shortName = data.shortName;
        context.symbol = data.symbol;
        context.price = data.ask;

        if (data.quoteType = "MUTUALFUND") {
            context.price = data.previousClose
        }
        that.LoadChart(context);
    });
};

Site.prototype.SubmitForm = function () {
    this.symbol = $("#symbol").val();
    this.GetQuote();
}

Site.prototype.LoadChart = function (quote) {

    var that = this;
    $.ajax({
        url: "/history?symbol=" + that.symbol,
        method: "GET",
        cache: false
    }).done(function (data) {
        that.RenderChart(JSON.parse(data), quote);
    });
};

Site.prototype.RenderChart = function (data, quote) {
    var priceData = [];
    var dates = [];

    var title = quote.shortName + " (" + quote.symbol + ") - " + numeral(quote.price).format('$0,0.00');

    for (var i in data.Close) {
        var dt = i.slice(0, i.length - 3);
        var dateString = moment.unix(dt).format("MM/YY");
        var close = data.Close[i];
        if (close != null) {
            priceData.push(data.Close[i]);
            dates.push(dateString);
        }
    }

    Highcharts.chart('chart_container', {
        title: {
            text: title
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        xAxis: {
            categories: dates,
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            },
            area: {
            }
        },
        series: [{
            type: 'area',
            color: '#B3FFFF',
            name: 'Price',
            data: priceData
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 640
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });

};

var site = new Site();

$(document).ready(() => {
    site.Init();
})
