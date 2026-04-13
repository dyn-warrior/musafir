"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockController = void 0;
const common_1 = require("@nestjs/common");
const mock_service_1 = require("./mock.service");
let MockController = class MockController {
    mockService;
    constructor(mockService) {
        this.mockService = mockService;
    }
    getFeed() {
        return this.mockService.getPosts();
    }
    getDestinations() {
        return this.mockService.getDestinations();
    }
    getStays() {
        return this.mockService.getStays();
    }
    getFestivals() {
        return this.mockService.getFestivals();
    }
    getDestinationById(id) {
        return this.mockService.getDestinationById(id);
    }
    getProfile() {
        return this.mockService.getProfile();
    }
    getWikis() {
        return this.mockService.getWikis();
    }
    getGoOutRequests() {
        return this.mockService.getGoOutRequests();
    }
    getStories() {
        return this.mockService.getStories();
    }
    addGoOutRequest(request) {
        return this.mockService.addGoOutRequest(request);
    }
    addGroup(group) {
        return this.mockService.addGroup(group);
    }
    toggleLike(id) {
        return this.mockService.toggleLike(Number(id));
    }
    updateProfile(profile) {
        return this.mockService.updateProfile(profile);
    }
    addComment(id, text) {
        return this.mockService.addComment(Number(id), text);
    }
    generateItinerary(prompt) {
        return this.mockService.generateItinerary(prompt);
    }
    savePost(id) {
        return this.mockService.savePost(Number(id));
    }
    getChats() {
        return this.mockService.getChats();
    }
    getMessages(id) {
        return this.mockService.getMessages(id);
    }
    sendMessage(id, text) {
        return this.mockService.sendMessage(id, text);
    }
    getWikiPage(id) {
        return this.mockService.getWikiPage(id);
    }
    getTrips() {
        return this.mockService.getTrips();
    }
};
exports.MockController = MockController;
__decorate([
    (0, common_1.Get)('feed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Get)('destinations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getDestinations", null);
__decorate([
    (0, common_1.Get)('stays'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getStays", null);
__decorate([
    (0, common_1.Get)('festivals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getFestivals", null);
__decorate([
    (0, common_1.Get)('destinations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getDestinationById", null);
__decorate([
    (0, common_1.Get)('profile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('wikis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getWikis", null);
__decorate([
    (0, common_1.Get)('go-out/requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getGoOutRequests", null);
__decorate([
    (0, common_1.Get)('stories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getStories", null);
__decorate([
    (0, common_1.Post)('go-out/requests'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "addGoOutRequest", null);
__decorate([
    (0, common_1.Post)('community/groups'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "addGroup", null);
__decorate([
    (0, common_1.Post)('posts/:id/like'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('posts/:id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "addComment", null);
__decorate([
    (0, common_1.Post)('ai/generate'),
    __param(0, (0, common_1.Body)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "generateItinerary", null);
__decorate([
    (0, common_1.Post)('posts/:id/save'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "savePost", null);
__decorate([
    (0, common_1.Get)('community/chats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getChats", null);
__decorate([
    (0, common_1.Get)('community/chats/:id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('community/chats/:id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('wiki/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getWikiPage", null);
__decorate([
    (0, common_1.Get)('trips'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MockController.prototype, "getTrips", null);
exports.MockController = MockController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [mock_service_1.MockService])
], MockController);
//# sourceMappingURL=mock.controller.js.map