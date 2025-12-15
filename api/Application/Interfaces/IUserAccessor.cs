namespace Application.Interfaces;

public interface IUserAccessor
{
    Guid? GetUserId();
    string? GetUsername();
}


