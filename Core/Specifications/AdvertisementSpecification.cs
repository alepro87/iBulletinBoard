using System;
using Core.Entities;

namespace Core.Specifications;

public class AdvertisementSpecification : BaseSpecification<Advertisement>
{
    public AdvertisementSpecification(AdvertisementSpecParams specParams) : base(x =>
        (string.IsNullOrEmpty(specParams.Search) || x.Title.ToLower().Contains(specParams.Search)) &&
        (specParams.Categories.Count == 0 || specParams.Categories.Contains(x.Category)) &&
        (specParams.Locations.Count == 0 || specParams.Locations.Contains(x.Location))
    )
    {
        ApplyPaging(specParams.PageSize * (specParams.PageIndex - 1), specParams.PageSize);
        
        switch (specParams.Sort)
        {
            case "dateAsc":
                AddOrderBy(x => x.PostDate);
                break;
            case "dateDesc":
                AddOrderByDescending(x => x.PostDate);
                break;
            default:
                AddOrderBy(x => x.Id);
                break;
        }
    }
}
