using Application.Posts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PostsController : BaseApiController
{
    [AllowAnonymous]
    [HttpGet("{postSlug}/stats")]
    public async Task<IActionResult> GetStats(string postSlug, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new GetStats.Query { PostSlug = postSlug }, ct));
    }

    [HttpPost("{postSlug}/like")]
    public async Task<IActionResult> ToggleLike(string postSlug, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new ToggleLike.Command { PostSlug = postSlug }, ct));
    }

    [HttpDelete("{postSlug}/like")]
    public async Task<IActionResult> Unlike(string postSlug, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new ToggleLike.Command { PostSlug = postSlug }, ct));
    }

    [HttpPost("{postSlug}/view")]
    public async Task<IActionResult> RecordView(string postSlug, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new RecordView.Command { PostSlug = postSlug }, ct));
    }
}


