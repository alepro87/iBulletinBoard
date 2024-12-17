using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities;

public class Advertisement : BaseEntity
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public string? PictureUrl { get; set; }
    public required string Category { get; set; }
    public DateTime PostDate { get; set; }
    public required string Location { get; set; }
}