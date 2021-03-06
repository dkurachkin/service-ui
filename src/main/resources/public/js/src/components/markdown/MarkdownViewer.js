/*
 * Copyright 2016 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/epam/ReportPortal
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Epoxy = require('backbone-epoxy');
    var SingletonMarkdownObject = require('components/markdown/SingletonMarkdownObject');



    var MainBreadcrumbsComponent = Epoxy.View.extend({
        className: 'markdown-viewer',
        events: {
        },

        initialize: function(options) {
            this.simpleMDE = new SingletonMarkdownObject();
            this.update(options.text);
        },
        update: function(text) {
            if(text) {
                var html = this.simpleMDE.markdown(text.escapeScript().indentSpases());
                var doc = document.createElement('div');
                var self = this;
                doc.innerHTML = html;
                $('img', doc).each(function() {
                    this.onload = function() {
                        self.trigger('load');
                    }
                });
                $('a', doc).each(function() {
                    $(this).attr({target: '_blank'});
                });
                this.$el.html(doc.innerHTML);
            } else {
                this.$el.html('');
            }
        },
    });


    return MainBreadcrumbsComponent;
});
