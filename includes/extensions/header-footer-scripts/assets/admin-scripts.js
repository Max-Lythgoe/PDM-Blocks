/**
 * Admin Scripts for Custom Code
 * Migrated from PDM Accelerate theme.
 */
jQuery(document).ready(function($) {
    'use strict';

    var snippetEditor = null;
    var headerCounter = $('.hfs-script-row input[name*="hfs_header_scripts"]').length;
    var footerCounter = $('.hfs-script-row input[name*="hfs_footer_scripts"]').length;
    var metaHeaderCounter = $('.hfs-meta-script-row input[name*="hfs_meta_header_scripts"]').length;
    var metaFooterCounter = $('.hfs-meta-script-row input[name*="hfs_meta_footer_scripts"]').length;

    // Add script row - Settings Page
    $(document).on('click', '.hfs-add-script', function(e) {
        e.preventDefault();
        var type = $(this).data('type');
        var container = $('#hfs-' + type + '-scripts-container');
        var index = type === 'header' ? headerCounter++ : footerCounter++;
        
        var row = '<div class="hfs-script-row">' +
            '<div class="hfs-script-header">' +
            '<input type="text" name="hfs_' + type + '_scripts[' + index + '][name]" value="" ' +
            'placeholder="Script Name (e.g., Google Analytics, Facebook Pixel)" class="hfs-script-name" />' +
            '<button type="button" class="button hfs-remove-script" title="Remove this script">' +
            '<span class="dashicons dashicons-trash"></span> Remove' +
            '</button>' +
            '</div>' +
            '<textarea name="hfs_' + type + '_scripts[' + index + '][code]" ' +
            'placeholder="Enter your script code here..." class="hfs-script-code" rows="8"></textarea>' +
            '</div>';
        
        container.append(row);
    });

    // Remove script row - Settings Page
    $(document).on('click', '.hfs-remove-script', function(e) {
        e.preventDefault();
        var row = $(this).closest('.hfs-script-row');
        
        if (confirm('Are you sure you want to remove this script?')) {
            row.fadeOut(300, function() {
                $(this).remove();
            });
        }
    });

    // Add script row - Meta Box
    $(document).on('click', '.hfs-add-meta-script', function(e) {
        e.preventDefault();
        var type = $(this).data('type');
        var container = $('#hfs-meta-' + type + '-scripts');
        var index = type === 'header' ? metaHeaderCounter++ : metaFooterCounter++;
        
        var row = '<div class="hfs-meta-script-row">' +
            '<div class="hfs-script-header">' +
            '<input type="text" name="hfs_meta_' + type + '_scripts[' + index + '][name]" value="" ' +
            'placeholder="Script Name" class="hfs-script-name" />' +
            '<button type="button" class="button hfs-remove-meta-script" title="Remove">' +
            '<span class="dashicons dashicons-trash"></span>' +
            '</button>' +
            '</div>' +
            '<textarea name="hfs_meta_' + type + '_scripts[' + index + '][code]" ' +
            'placeholder="Enter script code..." class="hfs-script-code" rows="6"></textarea>' +
            '</div>';
        
        container.append(row);
    });

    // Remove script row - Meta Box
    $(document).on('click', '.hfs-remove-meta-script', function(e) {
        e.preventDefault();
        var row = $(this).closest('.hfs-meta-script-row');
        
        if (confirm('Are you sure you want to remove this script?')) {
            row.fadeOut(300, function() {
                $(this).remove();
            });
        }
    });

    // PHP Snippets Functionality
    function initCodeMirror() {
        if (typeof wp !== 'undefined' && wp.codeEditor) {
            var editorElement = document.getElementById('snippet_code');
            if (editorElement) {
                $(editorElement).siblings('.CodeMirror').remove();
                $(editorElement).show();
            }
            
            var editorSettings = wp.codeEditor.defaultSettings ? _.clone(wp.codeEditor.defaultSettings) : {};
            
            editorSettings.codemirror = $.extend({}, editorSettings.codemirror || {}, {
                mode: 'text/x-php',
                lineNumbers: true,
                lineWrapping: true,
                indentUnit: 4,
                tabSize: 4,
                indentWithTabs: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
                theme: 'default'
            });

            if (editorElement) {
                snippetEditor = wp.codeEditor.initialize(editorElement, editorSettings);
            }
        }
    }

    $('#hfs-snippet-search').on('keyup', function() {
        filterSnippets();
    });

    $('#hfs-snippet-filter').on('change', function() {
        filterSnippets();
    });

    function filterSnippets() {
        var searchTerm = $('#hfs-snippet-search').val().toLowerCase();
        var categoryFilter = $('#hfs-snippet-filter').val().toLowerCase();
        
        $('.hfs-snippet-item').each(function() {
            var snippetName = $(this).data('snippet-name');
            var snippetCategory = $(this).data('snippet-category');
            var matchesSearch = searchTerm === '' || snippetName.includes(searchTerm);
            var matchesCategory = categoryFilter === '' || snippetCategory === categoryFilter;
            
            if (matchesSearch && matchesCategory) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        updateSelectAllState();
    }

    // --- Select All checkbox ---
    $('#hfs-select-all').on('change', function() {
        var isChecked = $(this).prop('checked');
        $('.hfs-snippet-item:visible .hfs-snippet-checkbox-input').prop('checked', isChecked);
    });

    $(document).on('change', '.hfs-snippet-checkbox-input', function() {
        updateSelectAllState();
    });

    function updateSelectAllState() {
        var $visible = $('.hfs-snippet-item:visible .hfs-snippet-checkbox-input');
        var $checked = $('.hfs-snippet-item:visible .hfs-snippet-checkbox-input:checked');
        $('#hfs-select-all').prop('checked', $visible.length > 0 && $visible.length === $checked.length);
        $('#hfs-select-all').prop('indeterminate', $checked.length > 0 && $checked.length < $visible.length);
    }

    // --- Export Snippets ---
    $('#hfs-export-snippets').on('click', function() {
        var selected = [];
        $('.hfs-snippet-checkbox-input:checked').each(function() {
            var $item = $(this).closest('.hfs-snippet-item');
            var data = $item.data('snippet-export');
            if (data) {
                selected.push(data);
            }
        });

        if (selected.length === 0) {
            alert('Please select at least one snippet to export.');
            return;
        }

        var blob = new Blob([JSON.stringify(selected, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'pdm-snippets-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // --- Import Snippets ---
    $('#hfs-import-snippets').on('click', function() {
        $('#hfs-import-file').val('').click();
    });

    $('#hfs-import-file').on('change', function() {
        var file = this.files[0];
        if (!file) { return; }

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var snippets = JSON.parse(e.target.result);
                if (!Array.isArray(snippets) || snippets.length === 0) {
                    alert('The file does not contain any valid snippets.');
                    return;
                }

                // Validate each snippet has required fields
                for (var i = 0; i < snippets.length; i++) {
                    if (!snippets[i].name || !snippets[i].code) {
                        alert('The file contains invalid snippet data.');
                        return;
                    }
                }

                // Populate import preview modal
                var $list = $('#hfs-import-snippets-list');
                $list.empty();

                snippets.forEach(function(snippet, index) {
                    var desc = snippet.description || '';
                    var cat = snippet.category || 'General';
                    var codePreview = snippet.code.length > 200
                        ? snippet.code.substring(0, 200).replace(/\n/g, ' ') + '...'
                        : snippet.code.replace(/\n/g, ' ');

                    var row = '<div class="hfs-import-snippet-item">' +
                        '<label class="hfs-import-checkbox-label">' +
                        '<input type="checkbox" class="hfs-import-checkbox" data-index="' + index + '" checked />' +
                        '<div class="hfs-import-snippet-info">' +
                        '<strong>' + $('<div/>').text(snippet.name).html() + '</strong>' +
                        '<span class="hfs-badge hfs-badge-category">' + $('<div/>').text(cat).html() + '</span>' +
                        (desc ? '<p class="hfs-snippet-description">' + $('<div/>').text(desc).html() + '</p>' : '') +
                        '<code class="hfs-import-code-preview">' + $('<div/>').text(codePreview).html() + '</code>' +
                        '</div>' +
                        '</label>' +
                        '</div>';
                    $list.append(row);
                });

                // Store parsed snippets for later use
                $('#pdm-hfs-import-modal').data('snippets', snippets);

                // Reset select-all for import
                $('#hfs-import-select-all').prop('checked', true);

                $('#pdm-hfs-import-modal').fadeIn(200);
            } catch (err) {
                alert('Invalid JSON file. Please select a valid export file.');
            }
        };
        reader.readAsText(file);
    });

    // Import select-all toggle
    $('#hfs-import-select-all').on('change', function() {
        var checked = $(this).prop('checked');
        $('.hfs-import-checkbox').prop('checked', checked);
    });

    // Import confirm button
    $('#hfs-import-confirm').on('click', function() {
        var snippets = $('#pdm-hfs-import-modal').data('snippets');
        if (!snippets) { return; }

        var selectedIndices = [];
        $('.hfs-import-checkbox:checked').each(function() {
            selectedIndices.push(parseInt($(this).data('index'), 10));
        });

        if (selectedIndices.length === 0) {
            alert('Please select at least one snippet to import.');
            return;
        }

        var toImport = selectedIndices.map(function(i) { return snippets[i]; });
        var $btn = $(this);
        $btn.prop('disabled', true).text('Importing...');

        $.ajax({
            url: hfsAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'pdm_hfs_import_snippets',
                nonce: (typeof hfsSnippetsNonces !== 'undefined') ? hfsSnippetsNonces.import : '',
                snippets: JSON.stringify(toImport)
            },
            success: function(response) {
                if (response.success) {
                    alert('Successfully imported ' + response.data.count + ' snippet(s).');
                    $('#pdm-hfs-import-modal').fadeOut(200);
                    location.reload();
                } else {
                    alert('Import failed: ' + (response.data && response.data.message ? response.data.message : 'Unknown error'));
                }
            },
            error: function() {
                alert('An error occurred during import. Please try again.');
            },
            complete: function() {
                $btn.prop('disabled', false).html('<span class="dashicons dashicons-download"></span> Import Selected');
            }
        });
    });

    $('#hfs-add-snippet').on('click', function() {
        $('#pdm-hfs-modal-title').text('Add New Snippet');
        $('#snippet_id').val('');
        $('#snippet_name').val('');
        $('#snippet_description').val('');
        $('#snippet_category').val('General');
        $('#snippet_code').val('');
        $('#pdm-hfs-default-notice').hide();
        
        $('#pdm-hfs-snippet-modal').fadeIn(200, function() {
            initCodeMirror();
            if (snippetEditor) {
                snippetEditor.codemirror.setValue('');
                snippetEditor.codemirror.refresh();
            }
        });
    });

    $(document).on('click', '.hfs-edit-snippet', function() {
        var snippet = $(this).data('snippet');
        var isDefault = $(this).data('is-default') === 1;
        
        $('#pdm-hfs-modal-title').text(isDefault ? 'Edit Default Snippet' : 'Edit Snippet');
        $('#snippet_id').val(snippet.id);
        $('#snippet_name').val(snippet.name);
        $('#snippet_description').val(snippet.description);
        $('#snippet_category').val(snippet.category);
        $('#snippet_code').val(snippet.code);
        
        if (isDefault) {
            $('#pdm-hfs-default-notice').show();
        } else {
            $('#pdm-hfs-default-notice').hide();
        }
        
        $('#pdm-hfs-snippet-modal').fadeIn(200, function() {
            initCodeMirror();
            if (snippetEditor) {
                snippetEditor.codemirror.setValue(snippet.code);
                snippetEditor.codemirror.refresh();
            }
        });
    });

    $('#pdm-hfs-snippet-form').on('submit', function(e) {
        if (snippetEditor) {
            snippetEditor.codemirror.save();
        }
        var code = $('#snippet_code').val().trim();
        if (!code) {
            e.preventDefault();
            alert('Please enter PHP code.');
            return false;
        }
    });

    $('.hfs-modal-close').on('click', function() {
        $(this).closest('.hfs-modal').fadeOut(200);
    });
});
