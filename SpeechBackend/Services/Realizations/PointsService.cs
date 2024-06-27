using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SpeechBackend.DTO;
using SpeechBackend.DTO.Points;
using SpeechBackend.DTO.Users;
using SpeechBackend.Entities;
using SpeechBackend.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace SpeechBackend.Services.Realizations
{
    public class PointsService:BaseService, IPointsService
    {
        readonly AppDbContext _context;
        readonly DbSet<Point> _table;
        readonly IMapper _mapper;

        public PointsService(AppDbContext context,IMapper mapper,IHttpContextAccessor httpContext) : base(httpContext)
        {
            _mapper = mapper;
            _context = context;
            _table = _context.Set<Point>();
        }
        public async Task<Result<bool>> CreatePoint(CreatePointsDto dto)
        {
            var item = _mapper.Map<Point>(dto);
            item.UserId = Guid.Parse(CurrentUserId!);
            await _table.AddAsync(item);
            await _context.SaveChangesAsync();
            return Result<bool>.Success(true);
        }

        public async Task<Result<List<ReadPointsDto>>> ReadPoints()
        {
            var items = await _table.Where(x => x.UserId.ToString() == CurrentUserId!).Include(x => x.User).ToListAsync();
            var averagePointsPerDay = await _table
                .Where(x => x.UserId.ToString() == CurrentUserId!)
                .GroupBy(x => x.Date.Date)
                .Select(g => new  ReadPointsDto
                {
                    Id = Guid.NewGuid(),
                    Date = g.Key.ToString("dd-MM-yyyy", CultureInfo.InvariantCulture),
                    Points = Convert.ToInt32( g.Average(x => x.Points))
                })
                .ToListAsync();

            return Result<List<ReadPointsDto>>.Success(averagePointsPerDay);
        }
    }
}
