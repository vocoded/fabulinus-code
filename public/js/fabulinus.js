$(function() {
    var blocks = [
        ['structure', 'Program Structure'],
        ['control', 'Control Flow'],
        ['function', 'Function Declaration and Usage'],
        ['var', 'Variable Declarations and Scope'],
        ['string', 'Strings'],
        ['map', 'Arrays and Maps'],
        ['io', 'Basic I/O'],
        ['io2', 'Intermediate I/O'],
        ['class', 'Classes'],
        ['datetime', 'Date and Time'],
        ['regex', 'Regular Expressions'],
        ['namespace', 'Namespacing/Packaging'],
        ['thread', 'Multi-Threading']
    ];

    var loading = false;
    var loaded = {};
    var blockTemplate = _.template($('#code-block-template').html());

    var fetchCodeBlocks = function(lang, onSuccess) {
        $.get({
            url: '/html/' + lang + '.html',
            success: function(data) {
                loaded[lang] = true;
                $('body').append(data);
                onSuccess();
            },
            error: function() {
                console.log("Unable to fetch language file");
            },
            complete: function() {
                loading = false;
            }
        });
    };

    var getCodeBlock = function(lang, block) {
        var $block = $("#ex-" + lang + "-" + block);
        if (!$block.length) {
            return "TBD";
        }

        var html = $.trim($block.html());
        try {
            return hljs.highlight(lang, html).value;
        } catch (e) {
            return html;
        }
    };

    var setCodeBlocks = function(lang) {
        blocks.forEach(function(block) {
            var code = getCodeBlock(lang, block[0]);

            if (code !== "" && code !== "TBD") {
                $('#ex-' + block[0]).html(blockTemplate({ title: block[1], code: code })).show();
            } else {
                $('#ex-' + block[0]).hide();
            }
        });
    };

    $('#language-select').on('change', function (e) {
        var lang = $(e.currentTarget).val();
        if (lang === 'none') {
            return;
        }

        if (!loaded[lang] && !loading) {
            loading = true;
            fetchCodeBlocks(lang, function () {
                setCodeBlocks(lang);
            });
        } else if (loaded[lang]) {
            setCodeBlocks(lang);
        }
    });
});
