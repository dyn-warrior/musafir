import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { MockService } from './mock.service';

@Controller()
export class MockController {
    constructor(private readonly mockService: MockService) { }

    @Get('feed')
    getFeed() {
        return this.mockService.getPosts();
    }

    @Get('destinations')
    getDestinations() {
        return this.mockService.getDestinations();
    }

    @Get('stays')
    getStays() {
        return this.mockService.getStays();
    }

    @Get('festivals')
    getFestivals() {
        return this.mockService.getFestivals();
    }
    @Get('destinations/:id')
    getDestinationById(@Param('id') id: string) {
        return this.mockService.getDestinationById(id);
    }

    @Get('profile')
    getProfile() {
        return this.mockService.getProfile();
    }

    @Get('wikis')
    getWikis() {
        return this.mockService.getWikis();
    }

    @Get('go-out/requests')
    getGoOutRequests() {
        return this.mockService.getGoOutRequests();
    }

    @Get('stories')
    getStories() {
        return this.mockService.getStories();
    }

    @Post('go-out/requests')
    addGoOutRequest(@Body() request: any) {
        return this.mockService.addGoOutRequest(request);
    }

    @Post('community/groups')
    addGroup(@Body() group: any) {
        return this.mockService.addGroup(group);
    }

    @Post('posts/:id/like')
    toggleLike(@Param('id') id: string) {
        return this.mockService.toggleLike(Number(id));
    }

    @Put('profile')
    updateProfile(@Body() profile: any) {
        return this.mockService.updateProfile(profile);
    }

    @Post('posts/:id/comments')
    addComment(@Param('id') id: string, @Body('text') text: string) {
        return this.mockService.addComment(Number(id), text);
    }

    @Post('ai/generate')
    generateItinerary(@Body('prompt') prompt: string) {
        return this.mockService.generateItinerary(prompt);
    }

    @Post('posts/:id/save')
    savePost(@Param('id') id: string) {
        return this.mockService.savePost(Number(id));
    }

    @Get('community/chats')
    getChats() {
        return this.mockService.getChats();
    }

    @Get('community/chats/:id/messages')
    getMessages(@Param('id') id: string) {
        return this.mockService.getMessages(id);
    }

    @Post('community/chats/:id/messages')
    sendMessage(@Param('id') id: string, @Body('text') text: string) {
        return this.mockService.sendMessage(id, text);
    }

    @Get('wiki/:id')
    getWikiPage(@Param('id') id: string) {
        return this.mockService.getWikiPage(id);
    }

    @Get('trips')
    getTrips() {
        return this.mockService.getTrips();
    }
}
