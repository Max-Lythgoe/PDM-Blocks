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
    }

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

    // Removed: click-outside-to-close — only the X button closes the modal
});
