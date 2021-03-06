/*
 * Copyright 2016 EPAM Systems
 * 
 * 
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
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
'use strict';

define(function(require, exports, module) {
    var Epoxy = require('backbone-epoxy');
    var $ = require('jquery');
    var _ = require('underscore');
    var coreService = require('coreService');
    
    var RegistryInfoModel = Epoxy.Model.extend({
        defaults: {
            uiBuildVersion: '',
            fullServicesHtml: '',
            authExtensions: {},
            bugTrackingExtensions: [],
            analyticsExtensions: {},
        },
        computeds: {
            sendStatistics: {
                deps: ['analyticsExtensions'],
                get: function(analyticsExtensions) {
                    return analyticsExtensions.all && analyticsExtensions.all.enabled;
                }
            }
        }
        ,
        initialize: function(){
            this.ready = $.Deferred();
            var self = this;
            
            coreService.getRegistryInfo()
                .done(function(data){
                    if(data && data.UI && data.UI.build) {
                        self.set({uiBuildVersion: data.UI.build.version})
                    }
                    if(data && data.UAT && data.UAT.auth_extensions){
                        self.set({authExtensions: data.UAT.auth_extensions});
                    }
                    if(data && data.API && data.API.extensions){
                        if(data.API.extensions.bugtracking) {
                            self.set({bugTrackingExtensions: data.API.extensions.bugtracking});
                        }
                        if(data.API.extensions.analytics) {
                            self.set({analyticsExtensions: data.API.extensions.analytics});
                        }
                    }

                    var fullServicesHtml = '';
                    _.each(data, function(service) {
                       if(service.build && service.build.name && service.build.version) {
                           fullServicesHtml+= '<span class="service-name">' + service.build.name + ': </span><span>' + service.build.version + ';</span>'
                       }
                    });
                    self.set({fullServicesHtml: fullServicesHtml});
                    self.ready.resolve();
                })
                .fail(function(){
                    self.ready.resolve();
                });
        }
    });
    
    return RegistryInfoModel;
});
