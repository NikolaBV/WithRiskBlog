using Application.Comments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CommentsController : BaseApiController
{
    [AllowAnonymous]
    [HttpGet("{postSlug}")]
    public async Task<IActionResult> GetComments(string postSlug, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new List.Query { PostSlug = postSlug }, ct));
    }

    [HttpPost]
    public async Task<IActionResult> CreateComment(Create.Command command, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(command, ct));
    }
}


